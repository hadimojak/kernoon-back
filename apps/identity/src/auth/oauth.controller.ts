import { Body, Controller, Post } from '@nestjs/common';
import { OauthAuthorizeDto, OauthTokenDto } from './oauth.dto';
import { OauthService } from './oauth.service';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauth: OauthService) {}

  @Post('authorize')
  authorize(@Body() dto: OauthAuthorizeDto) {
    return this.oauth.authorize({
      clientId: dto.clientId,
      redirectUri: dto.redirectUri,
      state: dto.state,
      codeChallenge: dto.codeChallenge,
      codeChallengeMethod: dto.codeChallengeMethod,
      phone: dto.phone,
      smsCode: dto.code,
    });
  }

  @Post('token')
  token(@Body() dto: OauthTokenDto) {
    return this.oauth.token({
      grantType: dto.grantType,
      code: dto.code,
      redirectUri: dto.redirectUri,
      clientId: dto.clientId,
      codeVerifier: dto.codeVerifier,
    });
  }
}
