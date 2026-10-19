import { Module } from '@nestjs/common';
import { AppConfigModule, HealthModule } from '@app/common';
import { AddressesController } from './addresses.controller';
import { AccountService } from './account.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [AppConfigModule, HealthModule.forRoot('account')],
  controllers: [AddressesController, PaymentsController],
  providers: [AccountService],
})
export class AppModule {}
