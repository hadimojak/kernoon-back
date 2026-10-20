import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { GatewayModule } from './gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [CartController],
})
export class CartModule {}
