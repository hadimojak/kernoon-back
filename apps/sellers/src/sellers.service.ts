import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerApplicationDto } from './dto';
import { SellerApplication } from './models/seller-application';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(SellerApplication)
    private readonly applications: Repository<SellerApplication>,
  ) {}

  async apply(dto: SellerApplicationDto) {
    const saved = await this.applications.save(
      this.applications.create({
        shop: dto.shop.trim(),
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone ?? '',
        province: dto.province ?? '',
        city: dto.city.trim(),
        status: 'pending',
      }),
    );
    return present(saved);
  }

  async list() {
    const rows = await this.applications.find({ order: { createdAt: 'DESC' } });
    return rows.map(present);
  }
}

function present(application: SellerApplication) {
  return {
    id: application.id,
    shop: application.shop,
    name: application.name,
    email: application.email,
    phone: application.phone,
    province: application.province,
    city: application.city,
    status: application.status,
    createdAt: application.createdAt.toISOString(),
  };
}
