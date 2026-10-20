import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailCodeService } from './email-code.service';
import { EmailDto, EmailLoginDto } from './email.dto';

@Controller('auth/email')
export class EmailController {
  constructor(
    private readonly codes: EmailCodeService,
    private readonly users: UsersService,
  ) {}

  @Post('code')
  code(@Body() dto: EmailDto) {
    return this.codes.request(dto.email);
  }

  @Post('login')
  async login(@Body() dto: EmailLoginDto) {
    const user = await this.codes.consume(dto.email, dto.code);
    return this.users.sessionFor(user.id);
  }
}
