import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule, ServiceClient } from '@app/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule.forRoot('orders'),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ServiceClient],
})
export class AppModule {}
