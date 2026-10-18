import {
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { reply } from './reply';
import { GatewayRequest, GatewayService } from './gateway.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class IdentityController {
  constructor(private readonly gateway: GatewayService) {}

  @Post('auth/signup')
  signup(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('identity', req, '/auth/signup'));
  }

  @Post('auth/login')
  login(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('identity', req, '/auth/login'));
  }

  @Post('auth/seller/login')
  sellerLogin(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('identity', req, '/auth/seller/login'),
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('identity', req, '/profile'));
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('identity', req, '/profile'));
  }

  @Patch('profile/password')
  @UseGuards(JwtAuthGuard)
  password(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('identity', req, '/profile/password'),
    );
  }
}
