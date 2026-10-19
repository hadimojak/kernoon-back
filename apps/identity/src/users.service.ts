import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { Repository } from 'typeorm';
import { PublicUser, Role } from '@app/contracts';
import {
  ChangePasswordDto,
  LoginDto,
  SignupDto,
  UpdateProfileDto,
} from './dto';
import { Customer } from './models/customer';
import { MasterSeller } from './models/master-seller';
import { Seller } from './models/seller';
import { IdentityUser } from './models';

const PASSWORD_RULE =
  'Password must be at least 6 characters and include an uppercase letter and a number';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
    @InjectRepository(Seller)
    private readonly sellers: Repository<Seller>,
    @InjectRepository(MasterSeller)
    private readonly masterSellers: Repository<MasterSeller>,
  ) {}

  async onModuleInit() {
    await this.seed(
      'hadi',
      'arbabi',
      'hadimojak@gmail.com',
      'Password1',
      'customer',
    );
    const owner = await this.seed(
      'Kernoon',
      'Owner',
      'owner@kernoon.test',
      'Password1',
      'masterSeller',
      'Kernoon',
    );
    await this.seed(
      'Kernoon',
      'Shop',
      'seller@kernoon.test',
      'Password1',
      'seller',
      undefined,
      owner.id,
    );
  }

  async signup(dto: SignupDto) {
    this.assertPassword(dto.password);
    const email = dto.email.trim().toLowerCase();
    if (await this.findByEmail(email)) {
      throw new ConflictException('An account with this email already exists');
    }

    const user = await this.createUser({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email,
      role: 'customer',
      password: dto.password,
    });
    return this.tokenResponse(user);
  }

  async login(dto: LoginDto, allowed: Role | Role[]) {
    const roles = Array.isArray(allowed) ? allowed : [allowed];
    const user = await this.findByEmail(dto.email.trim().toLowerCase());
    if (
      !user ||
      !roles.includes(user.role) ||
      !user.passwordHash ||
      !verifyPassword(dto.password, user.passwordHash)
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.tokenResponse(user);
  }

  async getProfile(userId: string) {
    return this.publicUser(await this.requireUser(userId));
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.requireUser(userId);
    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      const existing = await this.findByEmail(email);
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
    return this.publicUser(await this.saveUser(user));
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.requireUser(userId);
    if (
      !user.passwordHash ||
      !verifyPassword(dto.currentPassword, user.passwordHash)
    ) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    this.assertPassword(dto.newPassword);
    user.passwordHash = hashPassword(dto.newPassword);
    await this.saveUser(user);
    return { updated: true };
  }

  private async seed(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role,
    businessName?: string,
    masterSellerId?: string,
  ) {
    const existing = await this.findByEmail(email);
    if (existing) return existing;
    return this.createUser({
      firstName,
      lastName,
      email,
      password,
      role,
      businessName,
      masterSellerId,
    });
  }

  private async createUser(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    businessName?: string;
    masterSellerId?: string;
  }) {
    const shared = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: '',
      gender: '',
      passwordHash: hashPassword(input.password),
      googleSubject: null,
      emailVerified: true,
      phoneVerified: false,
    };

    if (input.role === 'customer') {
      return this.customers.save(this.customers.create(shared));
    }
    if (input.role === 'seller') {
      return this.sellers.save(
        this.sellers.create({
          ...shared,
          masterSellerId: input.masterSellerId ?? '',
        }),
      );
    }
    return this.masterSellers.save(
      this.masterSellers.create({
        ...shared,
        businessName: input.businessName ?? '',
      }),
    );
  }

  private async requireUser(userId: string) {
    const user =
      (await this.customers.findOne({ where: { id: userId } })) ??
      (await this.sellers.findOne({ where: { id: userId } })) ??
      (await this.masterSellers.findOne({ where: { id: userId } }));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async findByEmail(email: string) {
    return (
      (await this.customers.findOne({ where: { email } })) ??
      (await this.sellers.findOne({ where: { email } })) ??
      (await this.masterSellers.findOne({ where: { email } }))
    );
  }

  private saveUser(user: IdentityUser) {
    if (user.role === 'customer') return this.customers.save(user);
    if (user.role === 'seller') return this.sellers.save(user);
    return this.masterSellers.save(user);
  }

  private tokenResponse(user: IdentityUser) {
    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken, user: this.publicUser(user) };
  }

  private publicUser(user: IdentityUser): PublicUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email ?? '',
      phone: user.phone ?? '',
      gender: user.gender,
      role: user.role,
      createdAt: (user.createdAt instanceof Date
        ? user.createdAt
        : new Date()
      ).toISOString(),
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
