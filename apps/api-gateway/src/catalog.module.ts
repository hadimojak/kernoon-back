import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { GatewayModule } from './gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [CatalogController],
})
export class CatalogModule {}
