import { Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { GatewayRequest, GatewayService } from './gateway.service';
import { reply } from './reply';

@Controller('sellers')
export class SellersController {
  constructor(private readonly gateway: GatewayService) {}

  @Post('applications')
  apply(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('sellers', req, '/applications'));
  }
}
