import { Module } from '@nestjs/common';
import { ServiceClient } from '@app/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, ServiceClient],
})
export class OrdersModule {}
