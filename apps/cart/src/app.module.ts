import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { CartModule } from './cart.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('CART_DATABASE_URL'),
    HealthModule.forRoot('cart'),
    CartModule,
  ],
})
export class AppModule {}
