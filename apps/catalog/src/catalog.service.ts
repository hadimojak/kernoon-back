import { Injectable, NotFoundException } from '@nestjs/common';
import { catalogSeed, Category, SizeId } from '@app/contracts';

@Injectable()
export class CatalogService {
  private readonly products = catalogSeed.map((product) => ({ ...product }));

  list(category?: Category, size?: SizeId) {
    return this.products.filter((product) => {
      if (category && product.category !== category) return false;
      if (size && !product.sizes.includes(size)) return false;
      return true;
    });
  }

  get(id: string) {
    const product = this.products.find((item) => item.id === id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
}
