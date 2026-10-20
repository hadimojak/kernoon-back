import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailCodeService } from './email-code.service';
import { EmailDto, EmailLoginDto } from './email.dto';
import { PhoneCodeService } from './phone-code.service';
import { PhoneDto, PhoneLoginDto } from './phone.dto';

@Controller('auth/seller')
export class SellerOtpController {
  constructor(
    private readonly phones: PhoneCodeService,
    private readonly emails: EmailCodeService,
    private readonly users: UsersService,
  ) {}

  @Post('phone/code')
  async phoneCode(@Body() dto: PhoneDto) {
    await this.users.requireSellerByPhone(dto.phone);
    return this.phones.request(dto.phone);
  }

  @Post('phone/login')
  async phoneLogin(@Body() dto: PhoneLoginDto) {
    const phone = await this.phones.consume(dto.phone, dto.code);
    return this.users.sellerSessionForPhone(phone);
  }

  @Post('email/code')
  async emailCode(@Body() dto: EmailDto) {
    await this.users.requireSellerByEmail(dto.email);
    return this.emails.request(dto.email);
  }

  @Post('email/login')
  async emailLogin(@Body() dto: EmailLoginDto) {
    const user = await this.emails.consume(dto.email, dto.code);
    return this.users.sellerSessionFor(user);
  }
}
