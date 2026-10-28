import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import {
  clothingColorIds,
  ClothingColorId,
  sizeIds,
  SizeId,
  tiers,
  Tier,
} from '@app/contracts';

export class AddCartItemDto {
  @IsString()
  @MinLength(1)
  productId!: string;

  @IsIn(sizeIds)
  size!: SizeId;

  @IsIn(tiers)
  tier!: Tier;

  @IsOptional()
  @IsIn(clothingColorIds)
  color?: ClothingColorId;

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
