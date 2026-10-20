import { IsIn, IsString, MinLength } from 'class-validator';
import { PhoneLoginDto } from './phone.dto';

export class OauthAuthorizeDto extends PhoneLoginDto {
  @IsString()
  clientId!: string;

  @IsString()
  redirectUri!: string;

  @IsString()
  @MinLength(8)
  state!: string;

  @IsString()
  @MinLength(43)
  codeChallenge!: string;

  @IsIn(['S256'])
  codeChallengeMethod!: 'S256';
}

export class OauthTokenDto {
  @IsIn(['authorization_code'])
  grantType!: 'authorization_code';

  @IsString()
  code!: string;

  @IsString()
  redirectUri!: string;

  @IsString()
  clientId!: string;

  @IsString()
  @MinLength(43)
  codeVerifier!: string;
}
