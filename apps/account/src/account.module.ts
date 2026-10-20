import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AddressesController } from './addresses.controller';
import { DeliveryAddress } from './models/delivery-address';
import { ShetabCard } from './models/shetab-card';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryAddress, ShetabCard])],
  controllers: [AddressesController, PaymentsController],
  providers: [AccountService],
})
export class AccountModule {}
