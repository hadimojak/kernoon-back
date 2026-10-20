import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GatewayRequest, GatewayService } from './gateway.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { reply } from './reply';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly gateway: GatewayService) {}

  @Get('charges')
  list(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('payments', req, '/charges'));
  }

  @Get('charges/:id')
  get(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('payments', req, `/charges/${id}`));
  }

  @Post('charges')
  create(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('payments', req, '/charges'));
  }
}
