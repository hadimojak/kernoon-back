import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { requireUserId } from '@app/common';
import { ChangePasswordDto, UpdateProfileDto } from './account.dto';
import { UsersService } from './users.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly users: UsersService) {}

  @Get()
  get(@Req() req: Request) {
    return this.users.getProfile(requireUserId(req));
  }

  @Patch()
  update(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(requireUserId(req), dto);
  }

  @Patch('password')
  password(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    return this.users.changePassword(requireUserId(req), dto);
  }
}
