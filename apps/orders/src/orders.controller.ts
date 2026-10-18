import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { requireUserId } from '@app/common';
import { CreateOrderDto } from './dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@Req() req: Request) {
    return this.orders.list(requireUserId(req));
  }

  @Get(':id')
  get(@Req() req: Request, @Param('id') id: string) {
    return this.orders.get(requireUserId(req), id);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateOrderDto) {
    return this.orders.create(requireUserId(req), dto);
  }
}
