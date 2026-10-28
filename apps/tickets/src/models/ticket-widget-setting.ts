import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ticket_widget_settings')
export class TicketWidgetSetting {
  @PrimaryColumn('uuid')
  id!: string;

  /** Shop owner; one setting row per master seller shop. */
  @Column({ type: 'uuid', unique: true })
  masterSellerId!: string;

  @Column({ default: false })
  enabled!: boolean;

  @Column({ type: 'uuid', nullable: true })
  updatedBy!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
