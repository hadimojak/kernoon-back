import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { requireUserId } from '@app/common';
import { AccountService } from './account.service';
import { PaymentMethodDto } from './dto';

@Controller('payment-methods')
export class PaymentsController {
  constructor(private readonly account: AccountService) {}

  @Get()
  list(@Req() req: Request) {
    return this.account.listPayments(requireUserId(req));
  }

  @Get(':id')
  get(@Req() req: Request, @Param('id') id: string) {
    return this.account.getPayment(requireUserId(req), id);
  }

  @Post()
  add(@Req() req: Request, @Body() dto: PaymentMethodDto) {
    return this.account.addPayment(requireUserId(req), dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.account.removePayment(requireUserId(req), id);
  }
}
