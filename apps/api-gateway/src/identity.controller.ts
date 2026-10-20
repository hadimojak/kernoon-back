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

  @Post('auth/phone/code')
  phoneCode(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('identity', req, '/auth/phone/code'),
    );
  }

  @Post('auth/email/code')
  emailCode(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('identity', req, '/auth/email/code'),
    );
  }

  @Post('auth/email/login')
  emailLogin(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('identity', req, '/auth/email/login'),
    );
  }

  @Post('auth/phone/login')
  phoneLogin(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('identity', req, '/auth/phone/login'),
    );
  }

  @Post('oauth/authorize')
  authorize(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(
      res,
      this.gateway.forward('identity', req, '/oauth/authorize'),
    );
  }

  @Post('oauth/token')
  token(@Req() req: GatewayRequest, @Res({ passthrough: true }) res: Response) {
    return reply(res, this.gateway.forward('identity', req, '/oauth/token'));
  }

  @Post('auth/refresh')
  refresh(
    @Req() req: GatewayRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return reply(res, this.gateway.forward('identity', req, '/auth/refresh'));
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
