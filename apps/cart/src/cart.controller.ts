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
  get(@Req() req: Request) {
    return this.carts.get(this.owner(req));
  }

  @Post('items')
  add(@Req() req: Request, @Body() dto: AddCartItemDto) {
    return this.carts.add(this.owner(req), dto);
  }

  @Patch('items/:id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.carts.update(this.owner(req), id, dto.quantity);
  }

  @Delete('items/:id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.carts.remove(this.owner(req), id);
  }

  @Delete()
  clear(@Req() req: Request) {
    return this.carts.clear(this.owner(req));
  }

  private owner(req: Request) {
    const userId = req.header(USER_ID_HEADER);
    if (userId) return `user:${userId}`;
    const cartId = req.header(CART_ID_HEADER);
    if (!cartId || !/^[a-zA-Z0-9-]{8,64}$/.test(cartId)) {
      throw new BadRequestException('Send x-user-id or a valid x-cart-id');
    }
    return `guest:${cartId}`;
  }
}
