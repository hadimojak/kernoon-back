import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Basket, BasketItem } from './models/basket';

@Module({
  imports: [TypeOrmModule.forFeature([Basket, BasketItem])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
