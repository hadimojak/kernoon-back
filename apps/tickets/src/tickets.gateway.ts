import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Role } from '@app/contracts';
import { CreateMessageDto, CreateTicketDto } from './dto';
import { TicketActor, TicketsService } from './tickets.service';

type SocketUser = TicketActor & { email?: string };

@WebSocketGateway({
  cors: {
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:5000')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    credentials: true,
  },
  namespace: '/tickets',
})
export class TicketsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly tickets: TicketsService,
    private readonly jwt: JwtService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const user = this.userFromSocket(client);
      client.data.user = user;
      client.join(this.userRoom(user.id));
      if (user.role === 'masterSeller') {
        client.join(this.masterRoom(user.id));
      }
      if (user.role === 'seller') {
        client.join(this.sellerRoom(user.id));
      }
      client.emit('tickets:ready', { userId: user.id, role: user.role });
    } catch {
      client.emit('tickets:error', { message: 'Unauthorized' });
      client.disconnect(true);
    }
  }

  @SubscribeMessage('ticket:create')
  async createTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateTicketDto,
  ) {
    const user = this.requireUser(client);
    const created = await this.tickets.create(user, body);
    this.emitTicketCreated(created.ticket, created.message);
    return created;
  }

  @SubscribeMessage('ticket:join')
  async joinTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { ticketId: string },
  ) {
    const user = this.requireUser(client);
    const detail = await this.tickets.getForActor(user, body.ticketId);
    client.join(this.ticketRoom(body.ticketId));
    return detail;
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { ticketId: string } & CreateMessageDto,
  ) {
    const user = this.requireUser(client);
    const { ticketId, ...dto } = body;
    const result = await this.tickets.addMessage(user, ticketId, dto);
    this.server
      .to(this.ticketRoom(ticketId))
      .emit('message:new', result);
    this.emitToAssignees(result.ticket, 'ticket:updated', result.ticket);
    return result;
  }

  @SubscribeMessage('ticket:list')
  listTickets(@ConnectedSocket() client: Socket) {
    const user = this.requireUser(client);
    return this.tickets.listForActor(user);
  }

  emitWidgetUpdated(payload: { enabled: boolean; masterSellerId: string }) {
    this.server.emit('widget:updated', payload);
  }

  emitTicketCreated(
    ticket: {
      id: string;
      sellerId: string | null;
      masterSellerId: string | null;
      customerId: string;
    },
    message: unknown,
  ) {
    this.server.to(this.userRoom(ticket.customerId)).emit('ticket:created', {
      ticket,
      message,
    });
    this.emitToAssignees(ticket, 'ticket:created', { ticket, message });
    this.server
      .to(this.ticketRoom(ticket.id))
      .emit('ticket:created', { ticket, message });
  }

  private emitToAssignees(
    ticket: {
      sellerId: string | null;
      masterSellerId: string | null;
      customerId?: string;
    },
    event: string,
    payload: unknown,
  ) {
    if (ticket.sellerId) {
      this.server.to(this.sellerRoom(ticket.sellerId)).emit(event, payload);
    }
    if (ticket.masterSellerId) {
      this.server.to(this.masterRoom(ticket.masterSellerId)).emit(event, payload);
    }
  }

  private requireUser(client: Socket): SocketUser {
    const user = client.data.user as SocketUser | undefined;
    if (!user?.id) throw new Error('Unauthorized');
    return user;
  }

  private userFromSocket(client: Socket): SocketUser {
    const raw =
      (client.handshake.auth?.token as string | undefined) ||
      (typeof client.handshake.headers.authorization === 'string'
        ? client.handshake.headers.authorization
        : undefined);
    const token = raw?.startsWith('Bearer ') ? raw.slice(7) : raw;
    if (!token) throw new Error('Missing token');
    const payload = this.jwt.verify<{
      sub: string;
      email: string;
      role: Role;
      typ?: string;
      masterSellerId?: string;
    }>(token);
    if (payload.typ !== 'access') throw new Error('Invalid token');
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      masterSellerId:
        payload.masterSellerId ||
        (payload.role === 'masterSeller' ? payload.sub : undefined),
    };
  }

  private ticketRoom(id: string) {
    return `ticket:${id}`;
  }

  private userRoom(id: string) {
    return `user:${id}`;
  }

  private sellerRoom(id: string) {
    return `seller:${id}`;
  }

  private masterRoom(id: string) {
    return `master:${id}`;
  }
}
