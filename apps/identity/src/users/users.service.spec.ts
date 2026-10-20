import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RedisService } from '../infrastructure/redis.service';
import { Customer } from './models/customer';
import { MasterSeller } from './models/master-seller';
import { Seller } from './models/seller';
import { UsersService } from './users.service';

type Row = { id: string; email: string | null };

function memoryRepository<T extends Row>(Entity: new () => T) {
  const rows: T[] = [];
  return {
    create(data: Partial<T>) {
      return Object.assign(new Entity(), data);
    },
    save(row: T) {
      if (!row.id) row.id = `id-${rows.length + 1}`;
      const index = rows.findIndex((item) => item.id === row.id);
      if (index === -1) rows.push(row);
      else rows[index] = row;
      return Promise.resolve(row);
    },
    findOne({ where }: { where: Partial<T> }) {
      const found =
        rows.find((row) =>
          Object.entries(where).every(
            ([key, value]) => row[key as keyof T] === value,
          ),
        ) ?? null;
      return Promise.resolve(found);
    },
  } as unknown as Repository<T>;
}

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

describe('UsersService', () => {
  const jwt = {
    sign: jest.fn((payload: { jti?: string }) =>
      payload.jti ? `refresh:${payload.jti}` : 'access',
    ),
    verify: jest.fn((token: string) => ({
      sub: 'id-1',
      typ: 'refresh',
      jti: token.slice('refresh:'.length),
    })),
  } as unknown as JwtService;
  const config = {
    get: (_key: string, fallback?: string) => fallback,
  } as ConfigService;
  let users: UsersService;

  beforeEach(async () => {
    users = new UsersService(
      jwt,
      memoryRepository(Customer),
      memoryRepository(Seller),
      memoryRepository(MasterSeller),
      memoryRedis(),
      config,
    );
    await users.onModuleInit();
  });

  it('logs in the seeded customer', async () => {
    const result = await users.login(
      { email: 'hadimojak@gmail.com', password: '123456' },
      'customer',
    );
    expect(result.accessToken).toBe('access');
    expect(result.refreshToken.startsWith('refresh:')).toBe(true);
    expect(result.user.firstName).toBe('hadi');
    expect(result.user.role).toBe('customer');
  });

  it('rotates the refresh token', async () => {
    const login = await users.login(
      { email: 'hadimojak@gmail.com', password: '123456' },
      'customer',
    );
    const refreshed = await users.refresh(login.refreshToken);
    expect(refreshed.accessToken).toBe('access');
    expect(refreshed.refreshToken).not.toBe(login.refreshToken);
    await expect(users.refresh(login.refreshToken)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a customer password on the seller login', async () => {
    await expect(
      users.login(
        { email: 'hadimojak@gmail.com', password: '123456' },
        'seller',
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a short password on signup', async () => {
    await expect(
      users.signup({
        firstName: 'Ada',
        lastName: 'Lovelace',
        phone: '09120000001',
        email: 'ada@kernoon.test',
        password: 'short',
      }),
    ).rejects.toThrow(/uppercase letter/);
  });

  it('creates a customer from an Iranian mobile number', async () => {
    const created = await users.accountForPhone('+98 912 123 4567');
    expect(created.phone).toBe('09121234567');
    expect(created.role).toBe('customer');
    expect(created.phoneVerified).toBe(true);
    const again = await users.accountForPhone('09121234567');
    expect(again.id).toBe(created.id);
  });

  it('rejects a duplicate email', async () => {
    await expect(
      users.signup({
        firstName: 'Hadi',
        lastName: 'Arbabi',
        phone: '09120000002',
        email: 'hadimojak@gmail.com',
        password: 'Password1',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
