import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SellerProductsController } from './seller-products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController, SellerProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
