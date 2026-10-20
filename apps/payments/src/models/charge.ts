import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('charges')
export class Charge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  orderId!: string;

  @Column({ type: 'int' })
  amountToman!: number;

  @Column()
  gateway!: string;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ default: '' })
  authority!: string;

  @Column({ default: '' })
  refId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
