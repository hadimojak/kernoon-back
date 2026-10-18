import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@app/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule.forRoot('cart'),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class AppModule {}
