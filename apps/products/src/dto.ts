import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { categories, Category, sizeIds, SizeId } from '@app/contracts';

export class ListProductsQuery {
  @IsOptional()
  @IsIn(categories)
  category?: Category;

  @IsOptional()
  @IsIn(sizeIds)
  size?: SizeId;

  @IsOptional()
  @IsUUID()
  masterSellerId?: string;

  @IsOptional()
  @IsUUID()
  sellerId?: string;
}

export class SellerProductDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  nameFa!: string;

  @IsInt()
  @Min(1000)
  toman!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  usd?: number;

  @IsIn(categories)
  category!: Category;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(sizeIds, { each: true })
  sizes!: SizeId[];

  @IsInt()
  @Min(0)
  stock!: number;

  @IsString()
  description!: string;

  /** Cover / primary image URL or data-URL. */
  @IsOptional()
  @IsString()
  image?: string;

  /** Photo album (URLs or data-URLs). */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class CreateProductDto extends SellerProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  id?: string;

  @IsUUID()
  masterSellerId!: string;

  @IsUUID()
  sellerId!: string;
}
