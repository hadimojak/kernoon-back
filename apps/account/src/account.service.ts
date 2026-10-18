import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AddressDto, PaymentMethodDto } from './dto';

export type Address = AddressDto & { id: string; userId: string };
export type PaymentMethod = PaymentMethodDto & { id: string; userId: string };

@Injectable()
export class AccountService {
  private readonly addresses: Address[] = [];
  private readonly payments: PaymentMethod[] = [];

  listAddresses(userId: string) {
    return this.addresses.filter((address) => address.userId === userId);
  }

  getAddress(userId: string, id: string) {
    return this.requireAddress(userId, id);
  }

  addAddress(userId: string, dto: AddressDto) {
    const address: Address = {
      ...dto,
      phone: dto.phone ?? '',
      line2: dto.line2 ?? '',
      region: dto.region ?? '',
      isDefault: dto.isDefault ?? this.listAddresses(userId).length === 0,
      id: randomBytes(8).toString('hex'),
      userId,
    };
    if (address.isDefault) this.clearDefaultAddress(userId);
    this.addresses.push(address);
    return address;
  }

  removeAddress(userId: string, id: string) {
    const index = this.addresses.findIndex(
      (address) => address.userId === userId && address.id === id,
    );
    if (index === -1) throw new NotFoundException('Address not found');
    const [removed] = this.addresses.splice(index, 1);
    if (removed.isDefault) {
      const next = this.listAddresses(userId)[0];
      if (next) next.isDefault = true;
    }
    return { deleted: true };
  }

  listPayments(userId: string) {
    return this.payments.filter((payment) => payment.userId === userId);
  }

  getPayment(userId: string, id: string) {
    return this.requirePayment(userId, id);
  }

  addPayment(userId: string, dto: PaymentMethodDto) {
    const payment: PaymentMethod = {
      ...dto,
      isDefault: dto.isDefault ?? this.listPayments(userId).length === 0,
      id: randomBytes(8).toString('hex'),
      userId,
    };
    if (payment.isDefault) this.clearDefaultPayment(userId);
    this.payments.push(payment);
    return payment;
  }

  removePayment(userId: string, id: string) {
    const index = this.payments.findIndex(
      (payment) => payment.userId === userId && payment.id === id,
    );
    if (index === -1) throw new NotFoundException('Payment method not found');
    const [removed] = this.payments.splice(index, 1);
    if (removed.isDefault) {
      const next = this.listPayments(userId)[0];
      if (next) next.isDefault = true;
    }
    return { deleted: true };
  }

  private requireAddress(userId: string, id: string) {
    const address = this.addresses.find(
      (item) => item.userId === userId && item.id === id,
    );
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  private requirePayment(userId: string, id: string) {
    const payment = this.payments.find(
      (item) => item.userId === userId && item.id === id,
    );
    if (!payment) throw new NotFoundException('Payment method not found');
    return payment;
  }

  private clearDefaultAddress(userId: string) {
    for (const address of this.listAddresses(userId)) address.isDefault = false;
  }

  private clearDefaultPayment(userId: string) {
    for (const payment of this.listPayments(userId)) payment.isDefault = false;
  }
}
