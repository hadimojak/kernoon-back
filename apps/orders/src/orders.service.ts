import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CatalogProduct } from '@app/contracts';
import { lineTotal, ServiceClient, serviceUrls } from '@app/common';
import { CreateOrderDto } from './dto';

type AddressSnapshot = {
  id: string;
  fullName: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
};

type PaymentSnapshot = {
  id: string;
  brand: string;
  last4: string;
};

type OrderItem = {
  productId: string;
  name: string;
  size: string;
  tier: string;
  quantity: number;
  unitPriceUsd: number;
  unitPriceToman: number;
  lineUsd: number;
  lineToman: number;
};

export type Order = {
  id: string;
  userId: string;
  status: 'placed';
  items: OrderItem[];
  totalUsd: number;
  totalToman: number;
  address: AddressSnapshot;
  payment: PaymentSnapshot;
  createdAt: string;
};

@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [];

  constructor(private readonly client: ServiceClient) {}

  list(userId: string) {
    return this.orders.filter((order) => order.userId === userId);
  }

  get(userId: string, id: string) {
    const order = this.orders.find(
      (item) => item.userId === userId && item.id === id,
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(userId: string, dto: CreateOrderDto) {
    const urls = serviceUrls();
    const headers = { 'x-user-id': userId };
    const address = await this.readOwned<AddressSnapshot>(
      urls.account,
      'account',
      `/addresses/${dto.addressId}`,
      headers,
    );
    const payment = await this.readOwned<PaymentSnapshot>(
      urls.account,
      'account',
      `/payment-methods/${dto.paymentMethodId}`,
      headers,
    );

    const items: OrderItem[] = [];
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
      items.push({
        productId: product.id,
        name: product.name,
        size: line.size,
        tier: line.tier,
        quantity: line.quantity,
        unitPriceUsd: product.usd,
        unitPriceToman: product.toman,
        lineUsd: lineTotal(product.usd, line.quantity),
        lineToman: product.toman * line.quantity,
      });
    }

    const order: Order = {
      id: randomBytes(8).toString('hex'),
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
        line1: address.line1,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
      },
      payment: {
        id: payment.id,
        brand: payment.brand,
        last4: payment.last4,
      },
      createdAt: new Date().toISOString(),
    };
    this.orders.push(order);
    return order;
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
