import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { Repository } from 'typeorm';
import {
  PublicUser,
  Role,
  SEED_MASTER_SELLER_ID,
  SEED_SELLER_ID,
} from '@app/contracts';
import {
  ChangePasswordDto,
  LoginDto,
  SignupDto,
  UpdateProfileDto,
  UploadProfileImageDto,
} from './account.dto';
import { normalizePhone } from '../auth/phone';
import { Customer } from './models/customer';
import { MasterSeller } from './models/master-seller';
import { Seller } from './models/seller';
import { IdentityUser } from './models';
import { RedisService } from '../infrastructure/redis.service';

const PASSWORD_RULE =
  'Password must be at least 6 characters and include an uppercase letter and a number';
const ACCESS_TTL_SECONDS = 30 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

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
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seed(
      'hadi',
      'hadi',
      'arbabi',
      'hadimojak@gmail.com',
      '123456',
      'customer',
    );
    const owner = await this.seed(
      'owner',
      'Kernoon',
      'Owner',
      'owner@kernoon.test',
      '123456',
      'masterSeller',
      'Kernoon',
      undefined,
      SEED_MASTER_SELLER_ID,
    );
    await this.seed(
      'seller',
      'Kernoon',
      'Shop',
      'seller@kernoon.test',
      '123456',
      'seller',
      undefined,
      owner.id,
      SEED_SELLER_ID,
    );
  }

  async signup(dto: SignupDto) {
    this.assertPassword(dto.password);
    const phone = this.phoneNumber(dto.phone);
    if (await this.findByPhone(phone)) {
      throw new ConflictException('An account with this phone already exists');
    }

    const email = dto.email?.trim().toLowerCase() || null;
    if (email && (await this.findByEmail(email))) {
      throw new ConflictException('An account with this email already exists');
    }
    const username = this.accountName(dto.username);
    if (await this.findByUsername(username)) {
      throw new ConflictException(
        'An account with this username already exists',
      );
    }

    const user = await this.createUser({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      username,
      email,
      phone,
      role: 'customer',
      password: dto.password,
    });
    return this.tokenResponse(user);
  }

  async login(dto: LoginDto, allowed: Role | Role[]) {
    const roles = Array.isArray(allowed) ? allowed : [allowed];
    const identifier = (dto.username ?? dto.email ?? dto.phone ?? '').trim();
    const user = await this.findForPassword(identifier);
    if (
      !user ||
      !roles.includes(user.role) ||
      !user.passwordHash ||
      !verifyPassword(dto.password, user.passwordHash)
    ) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return this.tokenResponse(user);
  }

  async requireByEmail(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('No account uses this email');
    }
    return user;
  }

  async requireSellerByPhone(phoneInput: string) {
    const user = await this.findByPhone(this.phoneNumber(phoneInput));
    return this.requireSeller(user);
  }

  async requireSellerByEmail(emailInput: string) {
    return this.requireSeller(await this.requireByEmail(emailInput));
  }

  async sellerSessionForPhone(phoneInput: string) {
    const user = await this.requireSellerByPhone(phoneInput);
    user.phoneVerified = true;
    return this.tokenResponse(await this.saveUser(user));
  }

  sellerSessionFor(user: IdentityUser) {
    return this.tokenResponse(this.requireSeller(user));
  }

  private requireSeller(user: IdentityUser | null) {
    if (!user || (user.role !== 'seller' && user.role !== 'masterSeller')) {
      throw new UnauthorizedException('This account cannot open the sellers panel');
    }
    return user;
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
    if (dto.username) {
      const username = this.accountName(dto.username);
      const taken = await this.findByUsername(username);
      if (taken && taken.id !== user.id) {
        throw new ConflictException(
          'An account with this username already exists',
        );
      }
      user.username = username;
    }
    if (dto.phone !== undefined) {
      const phone = dto.phone.trim() ? this.phoneNumber(dto.phone) : null;
      if (phone) {
        const taken = await this.findByPhone(phone);
        if (taken && taken.id !== user.id) {
          throw new ConflictException(
            'An account with this phone already exists',
          );
        }
      }
      user.phone = phone;
    }
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

  async uploadProfileImage(userId: string, dto: UploadProfileImageDto) {
    const user = await this.requireUser(userId);
    const raw = dto.imageBase64.includes(',')
      ? dto.imageBase64.slice(dto.imageBase64.indexOf(',') + 1)
      : dto.imageBase64;
    let buffer: Buffer;
    try {
      buffer = Buffer.from(raw, 'base64');
    } catch {
      throw new BadRequestException('Invalid image data');
    }
    if (!buffer.length) {
      throw new BadRequestException('Image is empty');
    }
    if (buffer.length > 1_500_000) {
      throw new BadRequestException('Image must be 1.5MB or smaller');
    }
    if (!looksLikeImage(buffer, dto.mimeType)) {
      throw new BadRequestException('File is not a valid image');
    }
    user.avatarUrl = `data:${dto.mimeType};base64,${buffer.toString('base64')}`;
    return this.publicUser(await this.saveUser(user));
  }

  async removeProfileImage(userId: string) {
    const user = await this.requireUser(userId);
    user.avatarUrl = null;
    return this.publicUser(await this.saveUser(user));
  }

  private async seed(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role,
    businessName?: string,
    masterSellerId?: string,
    id?: string,
  ) {
    const existing = await this.findByEmail(email);
    if (existing) {
      if (!existing.username) {
        existing.username = username;
        return this.saveUser(existing);
      }
      return existing;
    }
    return this.createUser({
      id,
      username,
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
    id?: string;
    firstName: string;
    lastName: string;
    username: string | null;
    email: string | null;
    phone?: string | null;
    password: string;
    role: Role;
    businessName?: string;
    masterSellerId?: string;
  }) {
    const shared = {
      ...(input.id ? { id: input.id } : {}),
      firstName: input.firstName,
      lastName: input.lastName,
      username: input.username,
      email: input.email,
      phone: input.phone ?? null,
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

  async accountForPhone(phoneInput: string) {
    const phone = this.phoneNumber(phoneInput);
    const existing = await this.findByPhone(phone);
    if (existing) {
      existing.phoneVerified = true;
      return this.saveUser(existing);
    }

    return this.customers.save(
      this.customers.create({
        firstName: '',
        lastName: '',
        username: null,
        email: null,
        phone,
        gender: '',
        passwordHash: null,
        googleSubject: null,
        emailVerified: false,
        phoneVerified: true,
      }),
    );
  }

  sessionFor(userId: string) {
    return this.requireUser(userId).then((user) => this.tokenResponse(user));
  }

  private phoneNumber(input: string) {
    const phone = normalizePhone(input);
    if (!phone) {
      throw new BadRequestException('Enter an Iranian mobile number');
    }
    return phone;
  }

  private async requireUser(userId: string) {
    const user =
      (await this.customers.findOne({ where: { id: userId } })) ??
      (await this.sellers.findOne({ where: { id: userId } })) ??
      (await this.masterSellers.findOne({ where: { id: userId } }));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async findByPhone(phone: string) {
    return (
      (await this.customers.findOne({ where: { phone } })) ??
      (await this.sellers.findOne({ where: { phone } })) ??
      (await this.masterSellers.findOne({ where: { phone } }))
    );
  }

  private accountName(input: string) {
    return input.trim().toLowerCase();
  }

  private async findByUsername(username: string) {
    return (
      (await this.customers.findOne({ where: { username } })) ??
      (await this.sellers.findOne({ where: { username } })) ??
      (await this.masterSellers.findOne({ where: { username } }))
    );
  }

  private async findForPassword(identifier: string) {
    if (!identifier) return null;
    if (identifier.includes('@')) {
      return this.findByEmail(identifier.toLowerCase());
    }
    const phone = normalizePhone(identifier);
    if (phone) {
      const byPhone = await this.findByPhone(phone);
      if (byPhone) return byPhone;
    }
    return this.findByUsername(identifier.toLowerCase());
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

  async refresh(refreshToken: string) {
    let payload: { sub?: string; typ?: string; jti?: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.refreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (!payload.sub || payload.typ !== 'refresh' || !payload.jti) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const stored = await this.redis.get(this.refreshKey(payload.jti));
    if (stored !== payload.sub) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    await this.redis.del(this.refreshKey(payload.jti));
    return this.tokenResponse(await this.requireUser(payload.sub));
  }

  private async tokenResponse(user: IdentityUser) {
    const masterSellerId =
      user.role === 'masterSeller'
        ? user.id
        : user.role === 'seller'
          ? (user as Seller).masterSellerId
          : undefined;
    const accessToken = this.jwt.sign(
      {
        sub: user.id,
        email: user.email ?? '',
        role: user.role,
        ...(masterSellerId ? { masterSellerId } : {}),
        typ: 'access',
      },
      { expiresIn: ACCESS_TTL_SECONDS },
    );
    const jti = randomBytes(16).toString('hex');
    const refreshToken = this.jwt.sign(
      { sub: user.id, typ: 'refresh', jti },
      { secret: this.refreshSecret(), expiresIn: REFRESH_TTL_SECONDS },
    );
    await this.redis.set(this.refreshKey(jti), user.id, REFRESH_TTL_SECONDS);
    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TTL_SECONDS,
      user: this.publicUser(user),
    };
  }

  private refreshSecret() {
    return this.config.get<string>(
      'JWT_REFRESH_SECRET',
      'dev-only-refresh-change-me',
    );
  }

  private refreshKey(jti: string) {
    return `refresh:${jti}`;
  }

  private publicUser(user: IdentityUser): PublicUser {
    const masterSellerId =
      user.role === 'masterSeller'
        ? user.id
        : user.role === 'seller'
          ? (user as Seller).masterSellerId
          : undefined;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      gender: user.gender,
      role: user.role,
      ...(masterSellerId ? { masterSellerId } : {}),
      avatarUrl: user.avatarUrl ?? null,
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

function looksLikeImage(buffer: Buffer, mimeType: string) {
  if (mimeType === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8;
  }
  if (mimeType === 'image/png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (mimeType === 'image/webp') {
    return (
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'
    );
  }
  return false;
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
