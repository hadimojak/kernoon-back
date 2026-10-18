import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GatewayRequest, GatewayService } from './gateway.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { reply } from './reply';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly gateway: GatewayService) {}

  @Get()
  list(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('orders', req, '/orders'));
  }

  @Get(':id')
  get(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('orders', req, `/orders/${id}`));
  }
}
