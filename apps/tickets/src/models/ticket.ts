import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketMessage } from './ticket-message';

@Entity('tickets')
export class Ticket {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  kind!: 'product' | 'general';

  @Column({ type: 'varchar', default: 'open' })
  status!: 'open' | 'answered' | 'closed';

  @Column()
  subject!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column('uuid')
  customerId!: string;

  @Column({ type: 'varchar', default: '' })
  customerName!: string;

  @Column({ type: 'uuid', nullable: true })
  productId!: string | null;

  @Column({ type: 'varchar', default: '' })
  productName!: string;

  @Column({ type: 'uuid', nullable: true })
  sellerId!: string | null;

  @Column({ type: 'uuid', nullable: true })
  masterSellerId!: string | null;

  @OneToMany(() => TicketMessage, (message) => message.ticket)
  messages!: TicketMessage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
