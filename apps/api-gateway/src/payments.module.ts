import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [GatewayModule],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
