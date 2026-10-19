import { Module } from '@nestjs/common';
import {
  AppConfigModule,
  databaseModule,
  HealthModule,
  ServiceClient,
} from '@app/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('ORDERS_DATABASE_URL'),
    HealthModule.forRoot('orders'),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ServiceClient],
})
export class AppModule {}
