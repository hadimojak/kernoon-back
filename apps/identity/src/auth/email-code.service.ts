import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomInt, timingSafeEqual } from 'crypto';
import { RedisService } from '../infrastructure/redis.service';
import { UsersService } from '../users/users.service';
import { EmailSender } from './email.sender';

const CODE_TTL_SECONDS = 120;
const RESEND_TTL_SECONDS = 60;
const MAX_ATTEMPTS = 5;

type StoredCode = { hash: string; attempts: number };

@Injectable()
export class EmailCodeService {
  constructor(
    private readonly redis: RedisService,
    private readonly mail: EmailSender,
    private readonly users: UsersService,
    private readonly config: ConfigService,
  ) {}

  async request(emailInput: string) {
    const user = await this.users.requireByEmail(emailInput);
    const email = user.email ?? emailInput.trim().toLowerCase();
    const locked = await this.redis.get(this.sendKey(email));
    if (locked) {
      throw new HttpException(
        'Wait before requesting another code',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = String(randomInt(100000, 1000000));
    const stored: StoredCode = { hash: this.hash(code), attempts: 0 };
    await this.redis.set(
      this.codeKey(email),
      JSON.stringify(stored),
      CODE_TTL_SECONDS,
    );
    await this.redis.set(this.sendKey(email), '1', RESEND_TTL_SECONDS);
    await this.mail.sendCode(email, code);
    return { sent: true, expiresIn: CODE_TTL_SECONDS };
  }

  async consume(emailInput: string, code: string) {
    const user = await this.users.requireByEmail(emailInput);
    const email = user.email ?? emailInput.trim().toLowerCase();
    const raw = await this.redis.get(this.codeKey(email));
    if (!raw) throw new UnauthorizedException('Invalid or expired code');

    const stored = JSON.parse(raw) as StoredCode;
    const actual = Buffer.from(this.hash(code));
    const expected = Buffer.from(stored.hash);
    const matches =
      actual.length === expected.length && timingSafeEqual(actual, expected);
    if (!matches) {
      stored.attempts += 1;
      if (stored.attempts >= MAX_ATTEMPTS) {
        await this.redis.del(this.codeKey(email));
      } else {
        await this.redis.set(
          this.codeKey(email),
          JSON.stringify(stored),
          CODE_TTL_SECONDS,
        );
      }
      throw new UnauthorizedException('Invalid or expired code');
    }

    await this.redis.del(this.codeKey(email));
    return user;
  }

  private hash(code: string) {
    const pepper = this.config.get<string>('JWT_SECRET', 'dev-only-change-me');
    return createHash('sha256').update(`${pepper}:${code}`).digest('hex');
  }

  private codeKey(email: string) {
    return `email-code:${email}`;
  }

  private sendKey(email: string) {
    return `email-send:${email}`;
  }
}
