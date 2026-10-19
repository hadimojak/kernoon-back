import { Module } from '@nestjs/common';
import { AppConfigModule, HealthModule } from '@app/common';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

@Module({
  imports: [AppConfigModule, HealthModule.forRoot('sellers')],
  controllers: [SellersController],
  providers: [SellersService],
})
export class AppModule {}
