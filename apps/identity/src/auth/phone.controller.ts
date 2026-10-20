import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PhoneDto, PhoneLoginDto } from './phone.dto';
import { PhoneCodeService } from './phone-code.service';

@Controller('auth/phone')
export class PhoneController {
  constructor(
    private readonly codes: PhoneCodeService,
    private readonly users: UsersService,
  ) {}

  @Post('code')
  code(@Body() dto: PhoneDto) {
    return this.codes.request(dto.phone);
  }

  @Post('login')
  async login(@Body() dto: PhoneLoginDto) {
    const phone = await this.codes.consume(dto.phone, dto.code);
    const user = await this.users.accountForPhone(phone);
    return this.users.sessionFor(user.id);
  }
}
