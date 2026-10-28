import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListProductsQuery } from './dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get('products')
  list(@Query() query: ListProductsQuery) {
    return this.products.list(query);
  }

  @Get('products/:id')
  get(@Param('id') id: string) {
    return this.products.get(id);
  }
}
