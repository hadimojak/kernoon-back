import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { GatewayModule } from './gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [AccountController],
})
export class AccountModule {}
