import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
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

describe('UsersService', () => {
  const jwt = {
    sign: jest.fn().mockReturnValue('token'),
  } as unknown as JwtService;
  let users: UsersService;

  beforeEach(async () => {
    users = new UsersService(
      jwt,
      memoryRepository(Customer),
      memoryRepository(Seller),
      memoryRepository(MasterSeller),
    );
    await users.onModuleInit();
  });

  it('logs in the seeded customer', async () => {
    const result = await users.login(
      { email: 'hadimojak@gmail.com', password: 'Password1' },
      'customer',
    );
    expect(result.accessToken).toBe('token');
    expect(result.user.firstName).toBe('hadi');
    expect(result.user.role).toBe('customer');
  });

  it('rejects a customer password on the seller login', async () => {
    await expect(
      users.login(
        { email: 'hadimojak@gmail.com', password: 'Password1' },
        'seller',
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a short password on signup', async () => {
    await expect(
      users.signup({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@kernoon.test',
        password: 'short',
      }),
    ).rejects.toThrow(/uppercase letter/);
  });

  it('rejects a duplicate email', async () => {
    await expect(
      users.signup({
        firstName: 'Hadi',
        lastName: 'Arbabi',
        email: 'hadimojak@gmail.com',
        password: 'Password1',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
