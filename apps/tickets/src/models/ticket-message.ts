import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Ticket } from './ticket';

@Entity('ticket_messages')
export class TicketMessage {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  ticketId!: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
  ticket!: Ticket;

  @Column('uuid')
  senderId!: string;

  @Column({ type: 'varchar' })
  senderRole!: 'customer' | 'seller' | 'masterSeller';

  @Column({ type: 'varchar', default: '' })
  senderName!: string;

  @Column({ type: 'text' })
  body!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
