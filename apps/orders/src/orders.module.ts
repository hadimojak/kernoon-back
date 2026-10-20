import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceClient } from '@app/common';
import { ShopOrder, ShopOrderItem } from './models/shop-order';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopOrder, ShopOrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService, ServiceClient],
})
export class OrdersModule {}
