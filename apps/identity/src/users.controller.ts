import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.users.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.users.login(dto, 'customer');
  }

  @Post('seller/login')
  sellerLogin(@Body() dto: LoginDto) {
    return this.users.login(dto, ['seller', 'masterSeller']);
  }
}
