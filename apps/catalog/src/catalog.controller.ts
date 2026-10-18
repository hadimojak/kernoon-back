import { Controller, Get, Param, Query } from '@nestjs/common';
import { categories, sizeIds } from '@app/contracts';
import { ListProductsQuery } from './dto';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('products')
  list(@Query() query: ListProductsQuery) {
    return this.catalog.list(query.category, query.size);
  }

  @Get('products/:id')
  get(@Param('id') id: string) {
    return this.catalog.get(id);
  }

  @Get('categories')
  categories() {
    return categories.map((id) => ({ id }));
  }

  @Get('sizes')
  sizes() {
    return sizeIds.map((id) => ({ id }));
  }
}
