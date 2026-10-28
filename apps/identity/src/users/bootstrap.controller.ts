import { Controller, Get, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('bootstrap')
export class BootstrapController {
  constructor(private readonly users: UsersService) {}

  @Get('shop-owners')
  async shopOwners() {
    const owners = await this.users.shopOwnerIds();
    if (!owners) throw new NotFoundException('Seed shop owners not found');
    return owners;
  }
}
