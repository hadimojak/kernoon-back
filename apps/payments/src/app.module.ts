import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { PaymentsModule } from './payments.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('PAYMENTS_DATABASE_URL'),
    HealthModule.forRoot('payments'),
    PaymentsModule,
  ],
})
export class AppModule {}
