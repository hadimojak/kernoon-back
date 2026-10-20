import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerApplication } from './models/seller-application';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

@Module({
  imports: [TypeOrmModule.forFeature([SellerApplication])],
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}
