import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ListingDto } from './dto';
import { PanelService } from './panel.service';
import { requireSeller } from './require-seller';

@Controller()
export class PanelController {
  constructor(private readonly panel: PanelService) {}

  @Get('dashboard')
  dashboard(@Req() req: Request) {
    return this.panel.dashboard(requireSeller(req));
  }

  @Get('products')
  products(@Req() req: Request) {
    return this.panel.listProducts(requireSeller(req));
  }

  @Post('products')
  addProduct(@Req() req: Request, @Body() dto: ListingDto) {
    return this.panel.addProduct(requireSeller(req), dto);
  }

  @Delete('products/:id')
  removeProduct(@Req() req: Request, @Param('id') id: string) {
    return this.panel.removeProduct(requireSeller(req), id);
  }

  @Get('orders')
  orders(@Req() req: Request) {
    requireSeller(req);
    return this.panel.listOrders();
  }

  @Get('customers')
  customers(@Req() req: Request) {
    return this.panel.listCustomers(requireSeller(req));
  }
}
