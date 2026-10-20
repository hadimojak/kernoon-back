import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RedisService } from '../infrastructure/redis.service';
import { Customer } from '../users/models/customer';
import { MasterSeller } from '../users/models/master-seller';
import { Seller } from '../users/models/seller';
import { UsersService } from '../users/users.service';
import { OauthService } from './oauth.service';
import { PhoneCodeService } from './phone-code.service';

function memoryRedis() {
  const store = new Map<string, string>();
  return {
    get: (key: string) => Promise.resolve(store.get(key) ?? null),
    set: (key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    },
    del: (key: string) => {
      store.delete(key);
      return Promise.resolve();
    },
  } as unknown as RedisService;
}

describe('OauthService', () => {
  it('exchanges a phone proof for a bearer token', async () => {
    const verifier = 'a'.repeat(50);
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    const users = new UsersService(
      { sign: () => 'token' } as unknown as JwtService,
      memoryRepository(Customer),
      memoryRepository(Seller),
      memoryRepository(MasterSeller),
      memoryRedis(),
      { get: (_key: string, fallback?: string) => fallback } as ConfigService,
    );
    const oauth = new OauthService(
      { get: (_key: string, fallback?: string) => fallback } as ConfigService,
      memoryRedis(),
      {
        consume: () => Promise.resolve('09121234567'),
      } as unknown as PhoneCodeService,
      users,
    );

    const authorized = await oauth.authorize({
      clientId: 'kernoon-shop',
      redirectUri: 'http://localhost:5000/oauth/callback',
      state: 'state-123',
      codeChallenge: challenge,
      codeChallengeMethod: 'S256',
      phone: '09121234567',
      smsCode: '123456',
    });
    const token = await oauth.token({
      grantType: 'authorization_code',
      code: authorized.code,
      redirectUri: 'http://localhost:5000/oauth/callback',
      clientId: 'kernoon-shop',
      codeVerifier: verifier,
    });

    expect(token.access_token).toBe('token');
    expect(token.refresh_token).toBe('token');
    expect(token.token_type).toBe('Bearer');
    expect(token.user.phone).toBe('09121234567');
    expect(token.user.role).toBe('customer');
  });
});

function memoryRepository<T extends { id: string }>(Entity: new () => T) {
  const rows: T[] = [];
  return {
    create: (data: Partial<T>) => Object.assign(new Entity(), data),
    save: (row: T) => {
      if (!row.id) row.id = `id-${rows.length + 1}`;
      const index = rows.findIndex((item) => item.id === row.id);
      if (index === -1) rows.push(row);
      else rows[index] = row;
      return Promise.resolve(row);
    },
    findOne: ({ where }: { where: Partial<T> }) =>
      Promise.resolve(
        rows.find((row) =>
          Object.entries(where).every(
            ([key, value]) => row[key as keyof T] === value,
          ),
        ) ?? null,
      ),
  } as unknown as Repository<T>;
}
