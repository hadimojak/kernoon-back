import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomInt, timingSafeEqual } from 'crypto';
import { normalizePhone } from './phone';
import { RedisService } from '../infrastructure/redis.service';
import { SmsSender } from './sms.sender';

const CODE_TTL_SECONDS = 120;
const RESEND_TTL_SECONDS = 60;
const MAX_ATTEMPTS = 5;

type StoredCode = { hash: string; attempts: number };

@Injectable()
export class PhoneCodeService {
  constructor(
    private readonly redis: RedisService,
    private readonly sms: SmsSender,
    private readonly config: ConfigService,
  ) {}

  async request(phoneInput: string) {
    const phone = this.phone(phoneInput);
    const locked = await this.redis.get(this.sendKey(phone));
    if (locked) {
      throw new HttpException(
        'Wait before requesting another code',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = String(randomInt(100000, 1000000));
    const stored: StoredCode = { hash: this.hash(code), attempts: 0 };
    await this.redis.set(
      this.codeKey(phone),
      JSON.stringify(stored),
      CODE_TTL_SECONDS,
    );
    await this.redis.set(this.sendKey(phone), '1', RESEND_TTL_SECONDS);
    await this.sms.sendCode(phone, code);
    return { sent: true, expiresIn: CODE_TTL_SECONDS };
  }

  async consume(phoneInput: string, code: string) {
    const phone = this.phone(phoneInput);
    const raw = await this.redis.get(this.codeKey(phone));
    if (!raw) throw new UnauthorizedException('Invalid or expired code');

    const stored = JSON.parse(raw) as StoredCode;
    const actual = Buffer.from(this.hash(code));
    const expected = Buffer.from(stored.hash);
    const matches =
      actual.length === expected.length && timingSafeEqual(actual, expected);
    if (!matches) {
      stored.attempts += 1;
      if (stored.attempts >= MAX_ATTEMPTS) {
        await this.redis.del(this.codeKey(phone));
      } else {
        await this.redis.set(
          this.codeKey(phone),
          JSON.stringify(stored),
          CODE_TTL_SECONDS,
        );
      }
      throw new UnauthorizedException('Invalid or expired code');
    }

    await this.redis.del(this.codeKey(phone));
    return phone;
  }

  private phone(input: string) {
    const phone = normalizePhone(input);
    if (!phone) {
      throw new BadRequestException('Enter an Iranian mobile number');
    }
    return phone;
  }

  private hash(code: string) {
    const pepper = this.config.get<string>('JWT_SECRET', 'dev-only-change-me');
    return createHash('sha256').update(`${pepper}:${code}`).digest('hex');
  }

  private codeKey(phone: string) {
    return `phone-code:${phone}`;
  }

  private sendKey(phone: string) {
    return `phone-send:${phone}`;
  }
}
