import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { GatewayRequest, GatewayService } from './gateway.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { reply } from './reply';

@Controller('panel')
@UseGuards(JwtAuthGuard)
export class PanelController {
  constructor(private readonly gateway: GatewayService) {}

  @Get('dashboard')
  dashboard(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('panel', req, '/dashboard'));
  }

  @Get('products')
  products(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('panel', req, '/products'));
  }

  @Post('products')
  addProduct(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('panel', req, '/products'));
  }

  @Delete('products/:id')
  removeProduct(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('panel', req, `/products/${id}`));
  }

  @Get('orders')
  orders(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('panel', req, '/orders'));
  }

  @Get('customers')
  customers(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('panel', req, '/customers'));
  }
}
