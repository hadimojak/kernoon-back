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

@Controller()
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly gateway: GatewayService) {}

  @Get('addresses')
  listAddresses(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('account', req, '/addresses'));
  }

  @Post('addresses')
  addAddress(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('account', req, '/addresses'));
  }

  @Delete('addresses/:id')
  removeAddress(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('account', req, `/addresses/${id}`));
  }

  @Get('payment-methods')
  listPayments(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('account', req, '/payment-methods'));
  }

  @Post('payment-methods')
  addPayment(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('account', req, '/payment-methods'));
  }

  @Delete('payment-methods/:id')
  removePayment(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('account', req, `/payment-methods/${id}`),
    );
  }
}
