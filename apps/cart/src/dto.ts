import { IsIn, IsInt, IsString, Max, Min, MinLength } from 'class-validator';
import { sizeIds, SizeId, tiers, Tier } from '@app/contracts';

export class AddCartItemDto {
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

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  @Max(20)
  quantity!: number;
}
