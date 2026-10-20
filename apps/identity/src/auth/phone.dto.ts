import { IsString, MinLength } from 'class-validator';

export class PhoneDto {
  @IsString()
  phone!: string;
}

export class PhoneLoginDto extends PhoneDto {
  @IsString()
  @MinLength(6)
  code!: string;
}
