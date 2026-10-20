import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { RedisService } from '../infrastructure/redis.service';
import { UsersService } from '../users/users.service';
import { PhoneCodeService } from './phone-code.service';

const CODE_TTL_SECONDS = 60;

type StoredGrant = {
  userId: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
};

@Injectable()
export class OauthService {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly phoneCodes: PhoneCodeService,
    private readonly users: UsersService,
  ) {}

  async authorize(input: {
    clientId: string;
    redirectUri: string;
    state: string;
    codeChallenge: string;
    codeChallengeMethod: string;
    phone: string;
    smsCode: string;
  }) {
    this.assertClient(input.clientId, input.redirectUri);
    if (input.codeChallengeMethod !== 'S256') {
      throw new BadRequestException('code_challenge_method must be S256');
    }
    if (!input.state || input.state.length < 8) {
      throw new BadRequestException('state is required');
    }

    const phone = await this.phoneCodes.consume(input.phone, input.smsCode);
    const user = await this.users.accountForPhone(phone);
    const code = randomBytes(32).toString('base64url');
    const grant: StoredGrant = {
      userId: user.id,
      clientId: input.clientId,
      redirectUri: input.redirectUri,
      codeChallenge: input.codeChallenge,
    };
    await this.redis.set(
      this.key(code),
      JSON.stringify(grant),
      CODE_TTL_SECONDS,
    );

    const redirectTo = new URL(input.redirectUri);
    redirectTo.searchParams.set('code', code);
    redirectTo.searchParams.set('state', input.state);
    return { code, state: input.state, redirectTo: redirectTo.toString() };
  }

  async token(input: {
    grantType: string;
    code: string;
    redirectUri: string;
    clientId: string;
    codeVerifier: string;
  }) {
    if (input.grantType !== 'authorization_code') {
      throw new BadRequestException('Unsupported grant_type');
    }
    this.assertClient(input.clientId, input.redirectUri);

    const raw = await this.redis.get(this.key(input.code));
    if (!raw) throw new UnauthorizedException('Invalid or expired code');
    await this.redis.del(this.key(input.code));
    const grant = JSON.parse(raw) as StoredGrant;
    if (
      grant.clientId !== input.clientId ||
      grant.redirectUri !== input.redirectUri ||
      !pkceMatches(input.codeVerifier, grant.codeChallenge)
    ) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    const session = await this.users.sessionFor(grant.userId);
    return {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      token_type: 'Bearer' as const,
      expires_in: session.expiresIn,
      user: session.user,
    };
  }

  private assertClient(clientId: string, redirectUri: string) {
    const expected = this.config.get<string>('OAUTH_CLIENT_ID', 'kernoon-shop');
    const allowed = this.config
      .get<string>(
        'OAUTH_REDIRECT_URIS',
        'http://localhost:5000/oauth/callback',
      )
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    if (clientId !== expected || !allowed.includes(redirectUri)) {
      throw new UnauthorizedException('Unknown OAuth client');
    }
  }

  private key(code: string) {
    return `oauth-code:${code}`;
  }
}

function pkceMatches(verifier: string, challenge: string) {
  if (verifier.length < 43 || verifier.length > 128) return false;
  const actual = Buffer.from(
    createHash('sha256').update(verifier).digest('base64url'),
  );
  const expected = Buffer.from(challenge);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
