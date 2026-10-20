import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('shetab_cards')
export class ShetabCard {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  holderName!: string;

  @Column()
  bank!: string;

  @Column()
  last4!: string;

  @Column({ type: 'int' })
  expMonth!: number;

  @Column({ type: 'int' })
  expYear!: number;

  @Column({ default: false })
  isDefault!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
