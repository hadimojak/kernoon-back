import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { sizeIds, SizeId, tiers, Tier } from '@app/contracts';

export class OrderItemDto {
  @IsString()
  @MinLength(1)
  productId!: string;

  @IsIn(sizeIds)
  size!: SizeId;

  @IsIn(tiers)
  tier!: Tier;

  @IsInt()
  @Min(1)
  @Max(20)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(1)
  addressId!: string;

  @IsString()
  @MinLength(1)
  paymentMethodId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
