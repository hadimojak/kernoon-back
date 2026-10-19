import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule, ServiceClient } from '@app/common';
import { AccountController } from './account.controller';
import { CartController } from './cart.controller';
import { CatalogController } from './catalog.controller';
import { CheckoutController } from './checkout.controller';
import { GatewayService } from './gateway.service';
import { HealthController } from './health.controller';
import { IdentityController } from './identity.controller';
import { OrdersController } from './orders.controller';
import { SellersController } from './sellers.controller';

@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-only-change-me'),
      }),
    }),
  ],
  controllers: [
    HealthController,
    IdentityController,
    CatalogController,
    CartController,
    OrdersController,
    CheckoutController,
    AccountController,
    SellersController,
  ],
  providers: [ServiceClient, GatewayService],
})
export class AppModule {}
