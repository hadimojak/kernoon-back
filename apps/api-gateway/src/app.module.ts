import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/common';
import { AccountModule } from './account.module';
import { CartModule } from './cart.module';
import { CatalogModule } from './catalog.module';
import { GatewayModule } from './gateway.module';
import { HealthController } from './health.controller';
import { IdentityModule } from './identity.module';
import { OrdersModule } from './orders.module';
import { PanelModule } from './panel.module';
import { SellersModule } from './sellers.module';
import { TicketsModule } from './tickets.module';

@Module({
  imports: [
    AppConfigModule,
    GatewayModule,
    IdentityModule,
    CatalogModule,
    CartModule,
    OrdersModule,
    AccountModule,
    SellersModule,
    PanelModule,
    TicketsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
