import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { Response } from 'express';
import { ServiceClient, serviceUrls, USER_ID_HEADER } from '@app/common';
import { GatewayRequest } from './gateway.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { reply } from './reply';

class CheckoutDto {
  @IsString()
  @MinLength(1)
  addressId!: string;

  @IsString()
  @MinLength(1)
  paymentMethodId!: string;
}

type CartItemBody = {
  productId: string;
  size: string;
  tier: string;
  quantity: number;
};

type CartBody = { items?: CartItemBody[] };

@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  constructor(private readonly client: ServiceClient) {}

  @Post()
  async checkout(
    @Req() req: GatewayRequest,
    @Body() dto: CheckoutDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('Missing user');
    const urls = serviceUrls();
    const headers = { [USER_ID_HEADER]: userId };
    const cart = await this.client.send<CartBody>({
      baseUrl: urls.cart,
      service: 'cart',
      method: 'GET',
      path: '/cart',
      headers,
    });
    if (cart.status !== 200) return reply(res, Promise.resolve(cart));
    if (!cart.data?.items?.length) {
      throw new BadRequestException('Cart is empty');
    }

    const order = await this.client.send({
      baseUrl: urls.orders,
      service: 'orders',
      method: 'POST',
      path: '/orders',
      headers,
      body: {
        addressId: dto.addressId,
        paymentMethodId: dto.paymentMethodId,
        items: cart.data.items.map((item) => ({
          productId: item.productId,
          size: item.size,
          tier: item.tier,
          quantity: item.quantity,
        })),
      },
    });
    if (order.status >= 200 && order.status < 300) {
      await this.client.send({
        baseUrl: urls.cart,
        service: 'cart',
        method: 'DELETE',
        path: '/cart',
        headers,
      });
    }
    return reply(res, Promise.resolve(order));
  }
}
