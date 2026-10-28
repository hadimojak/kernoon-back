import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, SizeId } from '@app/contracts';
import { ListingDto } from './dto';
import { Listing, ShopCustomer } from './models/shop';

@Injectable()
export class PanelService {
  constructor(
    @InjectRepository(Listing)
    private readonly listings: Repository<Listing>,
    @InjectRepository(ShopCustomer)
    private readonly customers: Repository<ShopCustomer>,
  ) {}

  async dashboard(sellerId: string) {
    const [products, customers] = await Promise.all([
      this.listings.count({ where: { sellerId } }),
      this.customers.count({ where: { sellerId } }),
    ]);
    return { products, customers, orders: 0, revenueToman: 0 };
  }

  async listProducts(sellerId: string) {
    const rows = await this.listings.find({
      where: { sellerId },
      order: { createdAt: 'DESC' },
    });
    return rows.map(presentListing);
  }

  async addProduct(sellerId: string, dto: ListingDto) {
    const saved = await this.listings.save(
      this.listings.create({
        sellerId,
        name: dto.name.trim(),
        nameFa: dto.nameFa.trim(),
        toman: dto.toman,
        category: dto.category,
        sizes: dto.sizes,
        stock: dto.stock,
        image: dto.image?.trim() || '/clothes/onesie.svg',
      }),
    );
    return presentListing(saved);
  }

  async removeProduct(sellerId: string, id: string) {
    const row = await this.listings.findOne({ where: { sellerId, id } });
    if (!row) throw new NotFoundException('Product not found');
    await this.listings.remove(row);
    return { deleted: true };
  }

  listOrders() {
    return [];
  }

  async listCustomers(sellerId: string) {
    const rows = await this.customers.find({
      where: { sellerId },
      order: { createdAt: 'DESC' },
    });
    return rows.map(presentCustomer);
  }
}

function presentListing(listing: Listing) {
  return {
    id: listing.id,
    sellerId: listing.sellerId,
    name: listing.name,
    nameFa: listing.nameFa,
    toman: listing.toman,
    usd: 0,
    category: listing.category as Category,
    sizes: listing.sizes as SizeId[],
    stock: listing.stock,
    image: listing.image,
    createdAt: listing.createdAt.toISOString(),
  };
}

function presentCustomer(customer: ShopCustomer) {
  return {
    id: customer.id,
    sellerId: customer.sellerId,
    name: customer.name,
    phone: customer.phone,
    province: customer.province,
    city: customer.city,
    createdAt: customer.createdAt.toISOString(),
  };
}
