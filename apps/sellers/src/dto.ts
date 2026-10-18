import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

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
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(1)
  city!: string;
}
