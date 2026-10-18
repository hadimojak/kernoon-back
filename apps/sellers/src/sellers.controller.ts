import { Body, Controller, Get, Post } from '@nestjs/common';
import { SellerApplicationDto } from './dto';
import { SellersService } from './sellers.service';

@Controller()
export class SellersController {
  constructor(private readonly sellers: SellersService) {}

  @Post('applications')
  apply(@Body() dto: SellerApplicationDto) {
    return this.sellers.apply(dto);
  }

  @Get('applications')
  list() {
    return this.sellers.list();
  }
}
