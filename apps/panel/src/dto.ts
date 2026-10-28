import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { categories, Category, sizeIds, SizeId } from '@app/contracts';

export class ListingDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  nameFa!: string;

  @IsInt()
  @Min(1000)
  toman!: number;

  @IsIn(categories)
  category!: Category;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(sizeIds, { each: true })
  sizes!: SizeId[];

  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsString()
  image?: string;
}
