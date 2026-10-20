import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Charge } from './models/charge';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Charge])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
