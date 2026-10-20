import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('addresses')
export class DeliveryAddress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  fullName!: string;

  @Column()
  phone!: string;

  @Column()
  province!: string;

  @Column()
  city!: string;

  @Column()
  postalCode!: string;

  @Column()
  street!: string;

  @Column({ default: '' })
  plaque!: string;

  @Column({ default: '' })
  unit!: string;

  @Column({ default: false })
  isDefault!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
