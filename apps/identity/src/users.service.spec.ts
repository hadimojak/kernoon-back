import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const jwt = {
    sign: jest.fn().mockReturnValue('token'),
  } as unknown as JwtService;
  let users: UsersService;

  beforeEach(() => {
    users = new UsersService(jwt);
    users.onModuleInit();
  });

  it('logs in the seeded customer', () => {
    const result = users.login(
      { email: 'hadimojak@gmail.com', password: 'Password1' },
      'customer',
    );
    expect(result.accessToken).toBe('token');
    expect(result.user.firstName).toBe('hadi');
    expect(result.user.role).toBe('customer');
  });

  it('rejects a customer password on the seller login', () => {
    expect(() =>
      users.login(
        { email: 'hadimojak@gmail.com', password: 'Password1' },
        'seller',
      ),
    ).toThrow(UnauthorizedException);
  });

  it('rejects a short password on signup', () => {
    expect(() =>
      users.signup({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@kernoon.test',
        password: 'short',
      }),
    ).toThrow(/uppercase letter/);
  });

  it('rejects a duplicate email', () => {
    expect(() =>
      users.signup({
        firstName: 'Hadi',
        lastName: 'Arbabi',
        email: 'hadimojak@gmail.com',
        password: 'Password1',
      }),
    ).toThrow(ConflictException);
  });
});
