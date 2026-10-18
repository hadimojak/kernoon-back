import { IsIn, IsOptional } from 'class-validator';
import { categories, Category, sizeIds, SizeId } from '@app/contracts';

export class ListProductsQuery {
  @IsOptional()
  @IsIn(categories)
  category?: Category;

  @IsOptional()
  @IsIn(sizeIds)
  size?: SizeId;
}
