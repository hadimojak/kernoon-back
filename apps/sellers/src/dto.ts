import { IsEmail, IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { iranProvinces, IranProvince } from '@app/contracts';

export class SellerApplicationDto {
  @IsString()
  @MinLength(1)
  shop!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @Matches(/^09\d{9}$/)
  phone?: string;

  @IsOptional()
  @IsIn(iranProvinces)
  province?: IranProvince;

  @IsString()
  @MinLength(1)
  city!: string;
}
