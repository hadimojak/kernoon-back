import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { PublicUser, Role } from '@app/contracts';
import {
  ChangePasswordDto,
  LoginDto,
  SignupDto,
  UpdateProfileDto,
} from './dto';

type StoredUser = PublicUser & { passwordHash: string };

const PASSWORD_RULE =
  'Password must be at least 6 characters and include an uppercase letter and a number';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users = new Map<string, StoredUser>();

  constructor(private readonly jwt: JwtService) {}

  onModuleInit() {
    this.seed('hadi', 'arbabi', 'hadimojak@gmail.com', 'Password1', 'customer');
    this.seed('Kernoon', 'Shop', 'seller@kernoon.test', 'Password1', 'seller');
  }

  signup(dto: SignupDto) {
    this.assertPassword(dto.password);
    const email = dto.email.trim().toLowerCase();
    if (this.findByEmail(email)) {
      throw new ConflictException('An account with this email already exists');
    }

    const user = this.createUser({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email,
      role: 'customer',
      password: dto.password,
    });
    return this.tokenResponse(user);
  }

  login(dto: LoginDto, role: Role) {
    const user = this.findByEmail(dto.email.trim().toLowerCase());
    if (
      !user ||
      user.role !== role ||
      !verifyPassword(dto.password, user.passwordHash)
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.tokenResponse(user);
  }

  getProfile(userId: string) {
    return this.publicUser(this.requireUser(userId));
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = this.requireUser(userId);
    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      const existing = this.findByEmail(email);
      if (existing && existing.id !== user.id) {
        throw new ConflictException(
          'An account with this email already exists',
        );
      }
      user.email = email;
    }
    if (dto.firstName) user.firstName = dto.firstName.trim();
    if (dto.lastName) user.lastName = dto.lastName.trim();
    if (dto.phone !== undefined) user.phone = dto.phone.trim();
    if (dto.gender !== undefined) user.gender = dto.gender;
    return this.publicUser(user);
  }

  changePassword(userId: string, dto: ChangePasswordDto) {
    const user = this.requireUser(userId);
    if (!verifyPassword(dto.currentPassword, user.passwordHash)) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    this.assertPassword(dto.newPassword);
    user.passwordHash = hashPassword(dto.newPassword);
    return { updated: true };
  }

  private seed(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role,
  ) {
    this.createUser({ firstName, lastName, email, password, role });
  }

  private createUser(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
  }) {
    const user: StoredUser = {
      id: randomBytes(8).toString('hex'),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: '',
      gender: '',
      role: input.role,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(input.password),
    };
    this.users.set(user.id, user);
    return user;
  }

  private requireUser(userId: string) {
    const user = this.users.get(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private findByEmail(email: string) {
    return [...this.users.values()].find((user) => user.email === email);
  }

  private tokenResponse(user: StoredUser) {
    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken, user: this.publicUser(user) };
  }

  private publicUser(user: StoredUser): PublicUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private assertPassword(password: string) {
    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      throw new BadRequestException(PASSWORD_RULE);
    }
  }
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const actual = scryptSync(password, salt, 32);
  const expected = Buffer.from(hash, 'hex');
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
