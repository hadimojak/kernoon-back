import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { SellersController } from './sellers.controller';

@Module({
  imports: [GatewayModule],
  controllers: [SellersController],
})
export class SellersModule {}
