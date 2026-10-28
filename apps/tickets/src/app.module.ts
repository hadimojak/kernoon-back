import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { TicketsModule } from './tickets.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('TICKETS_DATABASE_URL'),
    HealthModule.forRoot('tickets'),
    TicketsModule,
  ],
})
export class AppModule {}
