import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressDto, PaymentMethodDto } from './dto';
import { DeliveryAddress } from './models/delivery-address';
import { ShetabCard } from './models/shetab-card';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(DeliveryAddress)
    private readonly addresses: Repository<DeliveryAddress>,
    @InjectRepository(ShetabCard)
    private readonly cards: Repository<ShetabCard>,
  ) {}

  async listAddresses(userId: string) {
    const rows = await this.addresses.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
    return rows.map(presentAddress);
  }

  async getAddress(userId: string, id: string) {
    return presentAddress(await this.requireAddress(userId, id));
  }

  async addAddress(userId: string, dto: AddressDto) {
    const count = await this.addresses.count({ where: { userId } });
    const isDefault = dto.isDefault ?? count === 0;
    if (isDefault) {
      await this.addresses.update({ userId }, { isDefault: false });
    }
    const saved = await this.addresses.save(
      this.addresses.create({
        userId,
        fullName: dto.fullName.trim(),
        phone: dto.phone,
        province: dto.province,
        city: dto.city.trim(),
        postalCode: dto.postalCode,
        street: dto.street.trim(),
        plaque: dto.plaque?.trim() ?? '',
        unit: dto.unit?.trim() ?? '',
        isDefault,
      }),
    );
    return presentAddress(saved);
  }

  async removeAddress(userId: string, id: string) {
    const row = await this.requireAddress(userId, id);
    await this.addresses.remove(row);
    if (row.isDefault) {
      const next = await this.addresses.findOne({
        where: { userId },
        order: { createdAt: 'ASC' },
      });
      if (next) {
        next.isDefault = true;
        await this.addresses.save(next);
      }
    }
    return { deleted: true };
  }

  async listPayments(userId: string) {
    const rows = await this.cards.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
    return rows.map(presentCard);
  }

  async getPayment(userId: string, id: string) {
    return presentCard(await this.requireCard(userId, id));
  }

  async addPayment(userId: string, dto: PaymentMethodDto) {
    const count = await this.cards.count({ where: { userId } });
    const isDefault = dto.isDefault ?? count === 0;
    if (isDefault) {
      await this.cards.update({ userId }, { isDefault: false });
    }
    const saved = await this.cards.save(
      this.cards.create({
        userId,
        holderName: dto.holderName.trim(),
        bank: dto.bank,
        last4: dto.last4,
        expMonth: dto.expMonth,
        expYear: dto.expYear,
        isDefault,
      }),
    );
    return presentCard(saved);
  }

  async removePayment(userId: string, id: string) {
    const row = await this.requireCard(userId, id);
    await this.cards.remove(row);
    if (row.isDefault) {
      const next = await this.cards.findOne({
        where: { userId },
        order: { createdAt: 'ASC' },
      });
      if (next) {
        next.isDefault = true;
        await this.cards.save(next);
      }
    }
    return { deleted: true };
  }

  private async requireAddress(userId: string, id: string) {
    const row = await this.addresses.findOne({ where: { userId, id } });
    if (!row) throw new NotFoundException('Address not found');
    return row;
  }

  private async requireCard(userId: string, id: string) {
    const row = await this.cards.findOne({ where: { userId, id } });
    if (!row) throw new NotFoundException('Payment method not found');
    return row;
  }
}

function presentAddress(address: DeliveryAddress) {
  return {
    id: address.id,
    userId: address.userId,
    fullName: address.fullName,
    phone: address.phone,
    province: address.province,
    city: address.city,
    postalCode: address.postalCode,
    street: address.street,
    plaque: address.plaque,
    unit: address.unit,
    isDefault: address.isDefault,
    line1: address.street,
    region: address.province,
    country: 'IR',
  };
}

function presentCard(card: ShetabCard) {
  return {
    id: card.id,
    userId: card.userId,
    holderName: card.holderName,
    bank: card.bank,
    brand: card.bank,
    last4: card.last4,
    expMonth: card.expMonth,
    expYear: card.expYear,
    isDefault: card.isDefault,
  };
}
