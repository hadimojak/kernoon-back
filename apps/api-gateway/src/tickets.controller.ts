import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { GatewayRequest, GatewayService } from './gateway.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { reply } from './reply';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly gateway: GatewayService) {}

  @Get('widget')
  widget(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('tickets', req, '/tickets/widget'));
  }

  @Get('widget/settings')
  @UseGuards(JwtAuthGuard)
  widgetSettings(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('tickets', req, '/tickets/widget/settings'),
    );
  }

  @Patch('widget')
  @UseGuards(JwtAuthGuard)
  setWidget(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('tickets', req, '/tickets/widget'));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('tickets', req, '/tickets'));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('tickets', req, '/tickets'));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  get(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('tickets', req, `/tickets/${id}`));
  }

  @Post(':id/messages')
  @UseGuards(JwtAuthGuard)
  message(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('tickets', req, `/tickets/${id}/messages`),
    );
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  status(
    @Req() req: GatewayRequest,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('tickets', req, `/tickets/${id}/status`),
    );
  }
}
