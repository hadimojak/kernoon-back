import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [GatewayModule],
  controllers: [TicketsController],
})
export class TicketsModule {}
