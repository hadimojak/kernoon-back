import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import {
  iranianBanks,
  IranianBank,
  iranProvinces,
  IranProvince,
} from '@app/contracts';

export class AddressDto {
  @IsString()
  @MinLength(1)
  fullName!: string;

  @Matches(/^09\d{9}$/)
  phone!: string;

  @IsIn(iranProvinces)
  province!: IranProvince;

  @IsString()
  @MinLength(1)
  city!: string;

  @Matches(/^\d{10}$/)
  postalCode!: string;

  @IsString()
  @MinLength(1)
  street!: string;

  @IsOptional()
  @IsString()
  plaque?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class PaymentMethodDto {
  @IsString()
  @MinLength(1)
  holderName!: string;

  @IsIn(iranianBanks)
  bank!: IranianBank;

  @Matches(/^\d{4}$/)
  last4!: string;

  @IsInt()
  @Min(1)
  @Max(12)
  expMonth!: number;

  @IsInt()
  @Min(2024)
  @Max(2100)
  expYear!: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
