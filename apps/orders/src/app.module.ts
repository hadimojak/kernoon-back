import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { OrdersModule } from './orders.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('ORDERS_DATABASE_URL'),
    HealthModule.forRoot('orders'),
    OrdersModule,
  ],
})
export class AppModule {}
