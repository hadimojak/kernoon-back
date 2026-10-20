import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { catalogSeed, CatalogProduct, Category, SizeId } from '@app/contracts';
import { Product } from './models/product';

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async onModuleInit() {
    if ((await this.products.count()) > 0) return;
    await this.products.save(
      catalogSeed.map((product, position) =>
        this.products.create({ ...product, sizes: [...product.sizes], position }),
      ),
    );
  }

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
  return {
    id: product.id,
    name: product.name,
    nameFa: product.nameFa,
    usd: product.usd,
    toman: product.toman,
    image: product.image,
    category: product.category as Category,
    sizes: product.sizes as SizeId[],
    stock: product.stock,
    description: product.description,
  };
}
