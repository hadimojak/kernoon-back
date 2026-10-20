import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { GatewayModule } from './gateway.module';
import { OrdersController } from './orders.controller';

@Module({
  imports: [GatewayModule],
  controllers: [OrdersController, CheckoutController],
})
export class OrdersModule {}
