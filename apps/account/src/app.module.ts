import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@app/common';
import { AddressesController } from './addresses.controller';
import { AccountService } from './account.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule.forRoot('account'),
  ],
  controllers: [AddressesController, PaymentsController],
  providers: [AccountService],
})
export class AppModule {}
