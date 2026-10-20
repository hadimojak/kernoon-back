import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

const USERNAME = /^[a-zA-Z0-9._]{3,32}$/;

export class SignupDto {
  @IsString()
  @MinLength(1)
  firstName!: string;

  @IsString()
  @MinLength(1)
  lastName!: string;

  @Matches(USERNAME)
  username!: string;

  @IsString()
  @MinLength(10)
  phone!: string;

  @IsOptional()
  @ValidateIf((dto: SignupDto) => Boolean(dto.email?.trim()))
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @ValidateIf((dto: LoginDto) => !dto.email?.trim() && !dto.phone?.trim())
  @Matches(USERNAME)
  username?: string;

  @ValidateIf((dto: LoginDto) => !dto.username?.trim() && !dto.phone?.trim())
  @IsEmail()
  email?: string;

  @ValidateIf((dto: LoginDto) => !dto.username?.trim() && !dto.email?.trim())
  @IsString()
  @MinLength(10)
  phone?: string;

  @IsString()
  password!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  lastName?: string;

  @IsOptional()
  @Matches(USERNAME)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['', 'female', 'male', 'nonbinary', 'prefer_not'])
  gender?: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}
