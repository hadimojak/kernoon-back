import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CatalogProduct,
  Category,
  ClothingColorId,
  defaultSizeGuide,
  SizeId,
} from '@app/contracts';
import { Product } from './models/product';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async list(category?: Category, size?: SizeId) {
    const rows = await this.products.find({ order: { position: 'ASC' } });
    return rows.map(present).filter((product) => {
      if (category && product.category !== category) return false;
      if (size && !product.sizes.includes(size)) return false;
      return true;
    });
  }

  async get(id: string) {
    const product = await this.products.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return present(product);
  }
}

function present(product: Product): CatalogProduct {
  const sizes = product.sizes as SizeId[];
  return {
    id: product.id,
    name: product.name,
    nameFa: product.nameFa,
    usd: product.usd,
    toman: product.toman,
    image: product.image,
    images: [product.image],
    category: product.category as Category,
    sizes,
    sizeGuide: defaultSizeGuide(sizes),
    colors: ['multi'] as ClothingColorId[],
    countryOfOrigin: 'Iran',
    stock: product.stock,
    description: product.description,
  };
}
