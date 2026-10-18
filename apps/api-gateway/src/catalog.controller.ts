import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { GatewayRequest, GatewayService } from './gateway.service';
import { reply } from './reply';

@Controller()
export class CatalogController {
  constructor(private readonly gateway: GatewayService) {}

  @Get('products')
  list(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('catalog', req, '/products'));
  }

  @Get('products/:id')
  get(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('catalog', req, `/products/${id}`));
  }

  @Get('categories')
  categories(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('catalog', req, '/categories'));
  }

  @Get('sizes')
  sizes(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('catalog', req, '/sizes'));
  }
}
