import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  MASTER_SELLER_ID_HEADER,
  USER_ID_HEADER,
  USER_ROLE_HEADER,
} from '@app/common';
import { Role } from '@app/contracts';
import {
  CreateMessageDto,
  CreateTicketDto,
  UpdateTicketStatusDto,
  UpdateWidgetDto,
} from './dto';
import { TicketsGateway } from './tickets.gateway';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly tickets: TicketsService,
    private readonly gateway: TicketsGateway,
  ) {}

  @Get('widget')
  widgetPublic() {
    return this.tickets.widgetStatus();
  }

  @Get('widget/settings')
  widgetSettings(@Req() req: Request) {
    return this.tickets.getWidgetForSeller(this.actor(req));
  }

  @Patch('widget')
  async setWidget(@Req() req: Request, @Body() dto: UpdateWidgetDto) {
    const result = await this.tickets.setWidget(this.actor(req), dto.enabled);
    this.gateway.emitWidgetUpdated(result);
    return result;
  }

  @Get()
  list(@Req() req: Request) {
    return this.tickets.listForActor(this.actor(req));
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateTicketDto) {
    const created = await this.tickets.create(this.actor(req), dto);
    this.gateway.emitTicketCreated(created.ticket, created.message);
    return created;
  }

  @Get(':id')
  get(@Req() req: Request, @Param('id') id: string) {
    return this.tickets.getForActor(this.actor(req), id);
  }

  @Post(':id/messages')
  async message(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ) {
    const result = await this.tickets.addMessage(this.actor(req), id, dto);
    this.gateway.server
      ?.to(`ticket:${id}`)
      .emit('message:new', result);
    return result;
  }

  @Patch(':id/status')
  status(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    return this.tickets.updateStatus(this.actor(req), id, dto);
  }

  private actor(req: Request) {
    const id = req.header(USER_ID_HEADER);
    const role = req.header(USER_ROLE_HEADER) as Role | undefined;
    const masterSellerId = req.header(MASTER_SELLER_ID_HEADER) || undefined;
    if (!id || !role) {
      throw new BadRequestException('Authentication required');
    }
    return { id, role, masterSellerId };
  }
}
