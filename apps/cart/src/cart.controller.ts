import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CART_ID_HEADER, USER_ID_HEADER } from '@app/common';
import { AddCartItemDto, UpdateCartItemDto } from './dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly carts: CartService) {}

  @Get()
  async get(@Req() req: Request) {
    return this.carts.get(await this.owner(req));
  }

  @Post('merge')
  async merge(@Req() req: Request) {
    const userId = req.header(USER_ID_HEADER);
    if (!userId) {
      throw new BadRequestException('Login required to merge cart');
    }
    const cartId = req.header(CART_ID_HEADER);
    if (!cartId || !/^[a-zA-Z0-9-]{8,64}$/.test(cartId)) {
      return this.carts.get(`user:${userId}`);
    }
    return this.carts.merge(`guest:${cartId}`, `user:${userId}`);
  }

  @Post('items')
  async add(@Req() req: Request, @Body() dto: AddCartItemDto) {
    return this.carts.add(await this.owner(req), dto);
  }

  @Patch('items/:id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.carts.update(await this.owner(req), id, dto.quantity);
  }

  @Delete('items/:id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this.carts.remove(await this.owner(req), id);
  }

  @Delete()
  async clear(@Req() req: Request) {
    return this.carts.clear(await this.owner(req));
  }

  private async owner(req: Request) {
    const userId = req.header(USER_ID_HEADER);
    const cartId = req.header(CART_ID_HEADER);
    if (userId) {
      const userOwner = `user:${userId}`;
      if (cartId && /^[a-zA-Z0-9-]{8,64}$/.test(cartId)) {
        await this.carts.merge(`guest:${cartId}`, userOwner);
      }
      return userOwner;
    }
    if (!cartId || !/^[a-zA-Z0-9-]{8,64}$/.test(cartId)) {
      throw new BadRequestException('Send x-user-id or a valid x-cart-id');
    }
    return `guest:${cartId}`;
  }
}
