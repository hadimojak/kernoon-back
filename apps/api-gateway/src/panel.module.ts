import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { PanelController } from './panel.controller';

@Module({
  imports: [GatewayModule],
  controllers: [PanelController],
})
export class PanelModule {}
