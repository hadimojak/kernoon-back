import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { ServiceClient, serviceUrls } from '@app/common';
import { Role } from '@app/contracts';
import {
  CreateMessageDto,
  CreateTicketDto,
  UpdateTicketStatusDto,
} from './dto';
import { Ticket } from './models/ticket';
import { TicketMessage } from './models/ticket-message';
import { TicketWidgetSetting } from './models/ticket-widget-setting';

export type TicketActor = {
  id: string;
  role: Role;
  masterSellerId?: string;
  name?: string;
};

@Injectable()
export class TicketsService implements OnModuleInit {
  constructor(
    @InjectRepository(Ticket)
    private readonly tickets: Repository<Ticket>,
    @InjectRepository(TicketMessage)
    private readonly messages: Repository<TicketMessage>,
    @InjectRepository(TicketWidgetSetting)
    private readonly widgets: Repository<TicketWidgetSetting>,
    private readonly client: ServiceClient,
  ) {}

  async onModuleInit() {
    const total = await this.widgets.count();
    if (total > 0) return;

    const masterSellerId = await this.fetchSeedMasterSellerId();
    if (!masterSellerId) return;

    await this.widgets.save(
      this.widgets.create({
        id: randomUUID(),
        masterSellerId,
        enabled: true,
        updatedBy: masterSellerId,
      }),
    );
  }

  private async fetchSeedMasterSellerId() {
    try {
      const response = await this.client.send<{ masterSellerId: string }>({
        baseUrl: serviceUrls().identity,
        service: 'identity',
        method: 'GET',
        path: '/bootstrap/shop-owners',
      });
      if (response.status === 200 && response.data?.masterSellerId) {
        return response.data.masterSellerId;
      }
    } catch {
      /* identity may be down during boot */
    }
    return null;
  }

  async widgetStatus() {
    const count = await this.widgets.count({ where: { enabled: true } });
    return { enabled: count > 0 };
  }

  async getWidgetForSeller(actor: TicketActor) {
    this.assertSeller(actor.role);
    const masterSellerId = this.shopMasterId(actor);
    const row = await this.widgets.findOne({ where: { masterSellerId } });
    return {
      enabled: row?.enabled ?? false,
      masterSellerId,
    };
  }

  async setWidget(actor: TicketActor, enabled: boolean) {
    this.assertSeller(actor.role);
    const masterSellerId = this.shopMasterId(actor);
    let row = await this.widgets.findOne({ where: { masterSellerId } });
    if (!row) {
      row = this.widgets.create({
        id: randomUUID(),
        masterSellerId,
        enabled,
        updatedBy: actor.id,
      });
    } else {
      row.enabled = enabled;
      row.updatedBy = actor.id;
    }
    const saved = await this.widgets.save(row);
    return { enabled: saved.enabled, masterSellerId };
  }

  async listForActor(actor: TicketActor) {
    if (actor.role === 'customer') {
      const rows = await this.tickets.find({
        where: { customerId: actor.id },
        order: { updatedAt: 'DESC' },
      });
      return rows.map(presentTicket);
    }

    this.assertSeller(actor.role);
    if (actor.role === 'masterSeller') {
      const rows = await this.tickets.find({
        where: { masterSellerId: actor.id },
        order: { updatedAt: 'DESC' },
      });
      return rows.map(presentTicket);
    }

    const masterSellerId = actor.masterSellerId;
    const rows = await this.tickets.find({
      where: { sellerId: actor.id },
      order: { updatedAt: 'DESC' },
    });
    // Sellers only see product tickets assigned to them (not general).
    const filtered = rows.filter((row) => row.kind === 'product');
    if (masterSellerId) {
      return filtered.map(presentTicket);
    }
    return filtered.map(presentTicket);
  }

  async getForActor(actor: TicketActor, id: string) {
    const ticket = await this.requireTicket(id);
    this.assertCanAccess(actor, ticket);
    const messages = await this.messages.find({
      where: { ticketId: id },
      order: { createdAt: 'ASC' },
    });
    return {
      ...presentTicket(ticket),
      messages: messages.map(presentMessage),
    };
  }

  async create(actor: TicketActor, dto: CreateTicketDto) {
    if (actor.role !== 'customer') {
      throw new ForbiddenException('Only customers can open tickets');
    }

    const widget = await this.widgetStatus();
    if (!widget.enabled) {
      throw new BadRequestException('Support chat is currently disabled');
    }

    let productId: string | null = null;
    let productName = '';
    let sellerId: string | null = null;
    let masterSellerId: string | null = null;
    const kind = dto.kind;

    if (kind === 'product') {
      if (!dto.productId) {
        throw new BadRequestException('productId is required for product tickets');
      }
      const product = await this.resolveProduct(dto.productId);
      productId = product.id;
      productName = product.name;
      sellerId = product.sellerId;
      masterSellerId = product.masterSellerId;
    } else {
      masterSellerId = await this.resolveDefaultMaster();
    }

    const ticket = await this.tickets.save(
      this.tickets.create({
        id: randomUUID(),
        kind,
        status: 'open',
        subject: dto.subject.trim(),
        body: dto.body.trim(),
        customerId: actor.id,
        customerName: (dto.customerName || actor.name || '').trim(),
        productId,
        productName,
        sellerId,
        masterSellerId,
      }),
    );

    const first = await this.messages.save(
      this.messages.create({
        id: randomUUID(),
        ticketId: ticket.id,
        senderId: actor.id,
        senderRole: 'customer',
        senderName: ticket.customerName,
        body: ticket.body,
      }),
    );

    return {
      ticket: presentTicket(ticket),
      message: presentMessage(first),
    };
  }

  async addMessage(actor: TicketActor, ticketId: string, dto: CreateMessageDto) {
    const ticket = await this.requireTicket(ticketId);
    this.assertCanAccess(actor, ticket);
    if (ticket.status === 'closed') {
      throw new BadRequestException('Ticket is closed');
    }

    const message = await this.messages.save(
      this.messages.create({
        id: randomUUID(),
        ticketId: ticket.id,
        senderId: actor.id,
        senderRole: actor.role,
        senderName: (dto.senderName || actor.name || '').trim(),
        body: dto.body.trim(),
      }),
    );

    if (actor.role === 'customer') {
      ticket.status = 'open';
    } else {
      ticket.status = 'answered';
    }
    ticket.updatedAt = new Date();
    await this.tickets.save(ticket);

    return {
      ticket: presentTicket(ticket),
      message: presentMessage(message),
    };
  }

  async updateStatus(
    actor: TicketActor,
    ticketId: string,
    dto: UpdateTicketStatusDto,
  ) {
    this.assertSeller(actor.role);
    const ticket = await this.requireTicket(ticketId);
    this.assertCanAccess(actor, ticket);
    ticket.status = dto.status;
    await this.tickets.save(ticket);
    return presentTicket(ticket);
  }

  private async requireTicket(id: string) {
    const ticket = await this.tickets.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    return ticket;
  }

  private assertCanAccess(actor: TicketActor, ticket: Ticket) {
    if (actor.role === 'customer') {
      if (ticket.customerId !== actor.id) {
        throw new ForbiddenException('Not your ticket');
      }
      return;
    }
    if (actor.role === 'masterSeller') {
      if (ticket.masterSellerId !== actor.id) {
        throw new ForbiddenException('Not your shop ticket');
      }
      return;
    }
    if (actor.role === 'seller') {
      if (ticket.sellerId !== actor.id || ticket.kind !== 'product') {
        throw new ForbiddenException('Not your product ticket');
      }
      return;
    }
    throw new ForbiddenException();
  }

  private assertSeller(role: Role) {
    if (role !== 'seller' && role !== 'masterSeller') {
      throw new ForbiddenException('Only sellers can manage tickets');
    }
  }

  private shopMasterId(actor: TicketActor) {
    if (actor.role === 'masterSeller') return actor.id;
    if (actor.masterSellerId) return actor.masterSellerId;
    throw new BadRequestException('masterSellerId is required');
  }

  private async resolveProduct(productId: string) {
    const response = await this.client.send<{
      id: string;
      name: string;
      sellerId?: string;
      masterSellerId?: string;
    }>({
      baseUrl: serviceUrls().products,
      service: 'products',
      method: 'GET',
      path: `/products/${productId}`,
    });
    if (response.status >= 400 || !response.data?.id) {
      throw new BadRequestException('Product not found');
    }
    if (!response.data.sellerId || !response.data.masterSellerId) {
      throw new BadRequestException('Product has no seller owner');
    }
    return {
      id: response.data.id,
      name: response.data.name,
      sellerId: response.data.sellerId,
      masterSellerId: response.data.masterSellerId,
    };
  }

  private async resolveDefaultMaster() {
    const enabled = await this.widgets.findOne({
      where: { enabled: true },
      order: { updatedAt: 'DESC' },
    });
    if (enabled?.masterSellerId) return enabled.masterSellerId;

    try {
      const response = await this.client.send<{ masterSellerId: string }>({
        baseUrl: serviceUrls().identity,
        service: 'identity',
        method: 'GET',
        path: '/bootstrap/shop-owners',
      });
      if (response.status === 200 && response.data?.masterSellerId) {
        return response.data.masterSellerId;
      }
    } catch {
      /* identity may be down */
    }
    return null;
  }
}

function presentTicket(ticket: Ticket) {
  return {
    id: ticket.id,
    kind: ticket.kind,
    status: ticket.status,
    subject: ticket.subject,
    body: ticket.body,
    customerId: ticket.customerId,
    customerName: ticket.customerName,
    productId: ticket.productId,
    productName: ticket.productName,
    sellerId: ticket.sellerId,
    masterSellerId: ticket.masterSellerId,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}

function presentMessage(message: TicketMessage) {
  return {
    id: message.id,
    ticketId: message.ticketId,
    senderId: message.senderId,
    senderRole: message.senderRole,
    senderName: message.senderName,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
  };
}
