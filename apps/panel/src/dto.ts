import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import {
  categories,
  Category,
  iranProvinces,
  IranProvince,
  sizeIds,
  SizeId,
} from '@app/contracts';

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

export class ShopCustomerDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @Matches(/^09\d{9}$/)
  phone!: string;

  @IsIn(iranProvinces)
  province!: IranProvince;

  @IsString()
  @MinLength(1)
  city!: string;
}
