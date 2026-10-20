import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing, ShopCustomer } from './models/shop';
import { PanelController } from './panel.controller';
import { PanelService } from './panel.service';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, ShopCustomer])],
  controllers: [PanelController],
  providers: [PanelService],
})
export class PanelModule {}
