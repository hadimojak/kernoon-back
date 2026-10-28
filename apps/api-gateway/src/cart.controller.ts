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
import { OptionalJwtAuthGuard } from './optional-jwt.guard';
import { reply } from './reply';

@Controller('cart')
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private readonly gateway: GatewayService) {}

  @Get()
  get(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('cart', req, '/cart'));
  }

  @Post('merge')
  merge(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('cart', req, '/cart/merge'));
  }

  @Post('items')
  add(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('cart', req, '/cart/items'));
  }

  @Delete('items/:id')
  remove(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('cart', req, `/cart/items/${id}`));
  }
}
