import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { requireUserId } from '@app/common';
import { AccountService } from './account.service';
import { AddressDto } from './dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly account: AccountService) {}

  @Get()
  list(@Req() req: Request) {
    return this.account.listAddresses(requireUserId(req));
  }

  @Get(':id')
  get(@Req() req: Request, @Param('id') id: string) {
    return this.account.getAddress(requireUserId(req), id);
  }

  @Post()
  add(@Req() req: Request, @Body() dto: AddressDto) {
    return this.account.addAddress(requireUserId(req), dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.account.removeAddress(requireUserId(req), id);
  }
}
