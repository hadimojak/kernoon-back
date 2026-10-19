import { Module } from '@nestjs/common';
import { AppConfigModule, HealthModule } from '@app/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [AppConfigModule, HealthModule.forRoot('cart')],
  controllers: [CartController],
  providers: [CartService],
})
export class AppModule {}
