import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import {
  catalogSeed,
  CatalogProduct,
  Category,
  Role,
  SEED_MASTER_SELLER_ID,
  SEED_SELLER_ID,
  SizeId,
} from '@app/contracts';
import { SellerProductDto } from './dto';
import { Product } from './models/product';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async onModuleInit() {
    if ((await this.products.count()) > 0) return;
    await this.products.save(
      catalogSeed.map((product, position) =>
        this.products.create({
          ...product,
          sizes: [...product.sizes],
          images: [...(product.images?.length ? product.images : [product.image])],
          position,
          masterSellerId: SEED_MASTER_SELLER_ID,
          sellerId: SEED_SELLER_ID,
        }),
      ),
    );
  }

  async list(filters: {
    category?: Category;
    size?: SizeId;
    masterSellerId?: string;
    sellerId?: string;
  }) {
    const rows = await this.products.find({ order: { position: 'ASC' } });
    return rows.map(present).filter((product) => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.size && !product.sizes.includes(filters.size)) return false;
      if (
        filters.masterSellerId &&
        product.masterSellerId !== filters.masterSellerId
      ) {
        return false;
      }
      if (filters.sellerId && product.sellerId !== filters.sellerId) {
        return false;
      }
      return true;
    });
  }

  async listForSeller(sellerId: string, role: Role, masterSellerId?: string) {
    if (role === 'masterSeller') {
      return this.list({ masterSellerId: sellerId });
    }
    if (role === 'seller') {
      return this.list({
        sellerId,
        ...(masterSellerId ? { masterSellerId } : {}),
      });
    }
    throw new ForbiddenException('Only sellers can manage shop products');
  }

  async get(id: string) {
    const product = await this.products.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return present(product);
  }

  async createForSeller(
    sellerId: string,
    role: Role,
    masterSellerId: string | undefined,
    dto: SellerProductDto,
  ) {
    this.assertSeller(role);
    const ownerMaster =
      role === 'masterSeller' ? sellerId : masterSellerId || sellerId;
    const images = normalizeImages(dto.images, dto.image);
    const position = (await this.products.count()) + 1;
    const toman = dto.toman;
    const usd = dto.usd ?? Math.max(1, Math.round(toman / 42000));
    const saved = await this.products.save(
      this.products.create({
        id: randomUUID(),
        name: dto.name.trim(),
        nameFa: dto.nameFa.trim(),
        usd,
        toman,
        image: images[0] || '/clothes/onesie.svg',
        images,
        category: dto.category,
        sizes: [...dto.sizes],
        stock: dto.stock,
        description: dto.description.trim(),
        position,
        masterSellerId: ownerMaster,
        sellerId,
      }),
    );
    return present(saved);
  }

  async updateForSeller(
    sellerId: string,
    role: Role,
    id: string,
    dto: SellerProductDto,
  ) {
    const product = await this.requireOwned(sellerId, role, id);
    const images = normalizeImages(dto.images, dto.image || product.image);
    product.name = dto.name.trim();
    product.nameFa = dto.nameFa.trim();
    product.toman = dto.toman;
    product.usd = dto.usd ?? Math.max(1, Math.round(dto.toman / 42000));
    product.category = dto.category;
    product.sizes = [...dto.sizes];
    product.stock = dto.stock;
    product.description = dto.description.trim();
    product.images = images;
    product.image = images[0] || product.image;
    return present(await this.products.save(product));
  }

  async removeForSeller(sellerId: string, role: Role, id: string) {
    const product = await this.requireOwned(sellerId, role, id);
    await this.products.remove(product);
    return { deleted: true };
  }

  private async requireOwned(sellerId: string, role: Role, id: string) {
    const product = await this.products.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    if (role === 'masterSeller') {
      if (product.masterSellerId !== sellerId) {
        throw new ForbiddenException('Not your product');
      }
      return product;
    }
    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Not your product');
    }
    return product;
  }

  private assertSeller(role: Role) {
    if (role !== 'seller' && role !== 'masterSeller') {
      throw new ForbiddenException('Only sellers can manage shop products');
    }
  }
}

function normalizeImages(images?: string[], cover?: string) {
  const album = (images ?? [])
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
  if (cover?.trim() && !album.includes(cover.trim())) {
    album.unshift(cover.trim());
  }
  if (!album.length) album.push('/clothes/onesie.svg');
  return album;
}

function present(product: Product): CatalogProduct {
  const images =
    product.images?.filter(Boolean).length > 0
      ? product.images.filter(Boolean)
      : [product.image];
  return {
    id: product.id,
    name: product.name,
    nameFa: product.nameFa,
    usd: product.usd,
    toman: product.toman,
    image: product.image || images[0],
    images,
    category: product.category as Category,
    sizes: product.sizes as SizeId[],
    stock: product.stock,
    description: product.description,
    masterSellerId: product.masterSellerId,
    sellerId: product.sellerId,
  };
}
