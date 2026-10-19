import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { AddressesController } from './addresses.controller';
import { AccountService } from './account.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('ACCOUNT_DATABASE_URL'),
    HealthModule.forRoot('account'),
  ],
  controllers: [AddressesController, PaymentsController],
  providers: [AccountService],
})
export class AppModule {}
