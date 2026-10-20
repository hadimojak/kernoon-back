import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { requireUserId } from '@app/common';
import { ChargeDto } from './dto';
import { PaymentsService } from './payments.service';

@Controller('charges')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get()
  list(@Req() req: Request) {
    return this.payments.list(requireUserId(req));
  }

  @Get(':id')
  get(@Req() req: Request, @Param('id') id: string) {
    return this.payments.get(requireUserId(req), id);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: ChargeDto) {
    return this.payments.create(requireUserId(req), dto);
  }
}
