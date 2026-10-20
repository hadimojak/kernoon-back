import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(1)
  firstName!: string;

  @IsString()
  @MinLength(1)
  lastName!: string;

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
  @ValidateIf((dto: LoginDto) => !dto.username?.trim())
  @IsEmail()
  email?: string;

  @ValidateIf((dto: LoginDto) => !dto.email?.trim())
  @IsString()
  @MinLength(1)
  username?: string;

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
