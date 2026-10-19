import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('SELLERS_DATABASE_URL'),
    HealthModule.forRoot('sellers'),
  ],
  controllers: [SellersController],
  providers: [SellersService],
})
export class AppModule {}
