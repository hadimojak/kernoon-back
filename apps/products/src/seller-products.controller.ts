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
import {
  MASTER_SELLER_ID_HEADER,
  USER_ID_HEADER,
  USER_ROLE_HEADER,
} from '@app/common';
import { Role } from '@app/contracts';
import { SellerProductDto } from './dto';
import { ProductsService } from './products.service';

@Controller('seller/products')
export class SellerProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@Req() req: Request) {
    const { sellerId, role, masterSellerId } = this.actor(req);
    return this.products.listForSeller(sellerId, role, masterSellerId);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: SellerProductDto) {
    const { sellerId, role, masterSellerId } = this.actor(req);
    return this.products.createForSeller(sellerId, role, masterSellerId, dto);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: SellerProductDto,
  ) {
    const { sellerId, role } = this.actor(req);
    return this.products.updateForSeller(sellerId, role, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const { sellerId, role } = this.actor(req);
    return this.products.removeForSeller(sellerId, role, id);
  }

  private actor(req: Request) {
    const sellerId = req.header(USER_ID_HEADER);
    const role = req.header(USER_ROLE_HEADER) as Role | undefined;
    const masterSellerId = req.header(MASTER_SELLER_ID_HEADER) || undefined;
    if (!sellerId || !role) {
      throw new BadRequestException('Seller authentication required');
    }
    return { sellerId, role, masterSellerId };
  }
}
