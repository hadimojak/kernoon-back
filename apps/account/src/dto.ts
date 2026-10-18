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
import { cardBrands, CardBrand } from '@app/contracts';

export class AddressDto {
  @IsString()
  @MinLength(1)
  fullName!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(1)
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  @MinLength(1)
  city!: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsString()
  @MinLength(1)
  postalCode!: string;

  @IsString()
  @MinLength(1)
  country!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class PaymentMethodDto {
  @IsString()
  @MinLength(1)
  holderName!: string;

  @IsIn(cardBrands)
  brand!: CardBrand;

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
