import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { IdentityController } from './identity.controller';

@Module({
  imports: [GatewayModule],
  controllers: [IdentityController],
})
export class IdentityModule {}
