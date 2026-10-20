import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AddressesController } from './addresses.controller';
import { PaymentsController } from './payments.controller';

@Module({
  controllers: [AddressesController, PaymentsController],
  providers: [AccountService],
})
export class AccountModule {}
