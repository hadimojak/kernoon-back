import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { SellerApplicationDto } from './dto';

export type SellerApplication = {
  id: string;
  shop: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'pending';
  createdAt: string;
};

@Injectable()
export class SellersService {
  private readonly applications: SellerApplication[] = [];

  apply(dto: SellerApplicationDto) {
    const application: SellerApplication = {
      id: randomBytes(8).toString('hex'),
      shop: dto.shop.trim(),
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone?.trim() ?? '',
      city: dto.city.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.applications.push(application);
    return application;
  }

  list() {
    return this.applications;
  }
}
