import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('CART_DATABASE_URL'),
    HealthModule.forRoot('cart'),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class AppModule {}
