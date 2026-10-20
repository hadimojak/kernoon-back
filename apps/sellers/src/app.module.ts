import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { SellersModule } from './sellers.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('SELLERS_DATABASE_URL'),
    HealthModule.forRoot('sellers'),
    SellersModule,
  ],
})
export class AppModule {}
