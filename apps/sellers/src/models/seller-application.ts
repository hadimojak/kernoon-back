import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seller_applications')
export class SellerApplication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  shop!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ default: '' })
  phone!: string;

  @Column({ default: '' })
  province!: string;

  @Column()
  city!: string;

  @Column({ default: 'pending' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
