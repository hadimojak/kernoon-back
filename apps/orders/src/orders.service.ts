import {
  BadRequestException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogProduct } from '@app/contracts';
import { lineTotal, ServiceClient, serviceUrls } from '@app/common';
import { CreateOrderDto } from './dto';
import { ShopOrder, ShopOrderItem } from './models/shop-order';

type AccountAddress = {
  id: string;
  fullName: string;
  phone?: string;
  province?: string;
  city: string;
  postalCode: string;
  street?: string;
  line1?: string;
  plaque?: string;
  unit?: string;
  region?: string;
};

type AccountPayment = {
  id: string;
  bank?: string;
  brand?: string;
  last4: string;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly client: ServiceClient,
    @InjectRepository(ShopOrder)
    private readonly orders: Repository<ShopOrder>,
    @InjectRepository(ShopOrderItem)
    private readonly orderItems: Repository<ShopOrderItem>,
  ) {}

  async list(userId: string) {
    const rows = await this.orders.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return rows.map(present);
  }

  async create(userId: string, dto: CreateOrderDto) {
    const urls = serviceUrls();
    const headers = { 'x-user-id': userId };
    const address = await this.readOwned<AccountAddress>(
      urls.account,
      'account',
      `/addresses/${dto.addressId}`,
      headers,
    );
    const payment = await this.readOwned<AccountPayment>(
      urls.account,
      'account',
      `/payment-methods/${dto.paymentMethodId}`,
      headers,
    );

    const items: ShopOrderItem[] = [];
    for (const line of dto.items) {
      const product = await this.readOwned<CatalogProduct>(
        urls.catalog,
        'catalog',
        `/products/${line.productId}`,
        {},
      );
      if (!product.sizes.includes(line.size)) {
        throw new BadRequestException(
          `${product.name} is not sold in size ${line.size}`,
        );
      }
      items.push(
        this.orderItems.create({
          productId: product.id,
          name: product.name,
          size: line.size,
          tier: line.tier,
          quantity: line.quantity,
          unitPriceUsd: product.usd,
          unitPriceToman: product.toman,
          lineUsd: lineTotal(product.usd, line.quantity),
          lineToman: product.toman * line.quantity,
        }),
      );
    }

    const street = address.street || address.line1 || '';
    const province = address.province || address.region || '';
    const bank = payment.bank || payment.brand || '';
    const saved = await this.orders.save(
      this.orders.create({
        userId,
        status: 'placed',
        items,
        totalUsd: lineTotal(
          items.reduce((sum, item) => sum + item.lineUsd, 0),
          1,
        ),
        totalToman: items.reduce((sum, item) => sum + item.lineToman, 0),
        address: {
          id: address.id,
          fullName: address.fullName,
          phone: address.phone ?? '',
          province,
          city: address.city,
          postalCode: address.postalCode,
          street,
          plaque: address.plaque ?? '',
          unit: address.unit ?? '',
        },
        payment: {
          id: payment.id,
          bank,
          last4: payment.last4,
        },
      }),
    );
    return present(saved);
  }

  private async readOwned<T>(
    baseUrl: string,
    service: string,
    path: string,
    headers: Record<string, string>,
  ) {
    const result = await this.client.send<T>({
      baseUrl,
      service,
      method: 'GET',
      path,
      headers,
    });
    if (result.status !== 200 || !result.data) {
      const message =
        result.data &&
        typeof result.data === 'object' &&
        'message' in result.data
          ? (result.data as { message: string | string[] }).message
          : `${service} request failed`;
      throw new HttpException(message, result.status || 502);
    }
    return result.data;
  }
}

function present(order: ShopOrder) {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      size: item.size,
      tier: item.tier,
      quantity: item.quantity,
      unitPriceUsd: item.unitPriceUsd,
      unitPriceToman: item.unitPriceToman,
      lineUsd: item.lineUsd,
      lineToman: item.lineToman,
    })),
    totalUsd: order.totalUsd,
    totalToman: order.totalToman,
    address: {
      ...order.address,
      line1: order.address.street,
      region: order.address.province,
      country: 'IR',
    },
    payment: {
      ...order.payment,
      brand: order.payment.bank,
    },
    createdAt: order.createdAt.toISOString(),
  };
}
