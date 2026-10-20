import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { AccountModule } from './account.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('ACCOUNT_DATABASE_URL'),
    HealthModule.forRoot('account'),
    AccountModule,
  ],
})
export class AppModule {}
