import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  sellerId!: string;

  @Column()
  name!: string;

  @Column()
  nameFa!: string;

  @Column({ type: 'int' })
  toman!: number;

  @Column()
  category!: string;

  @Column('simple-array')
  sizes!: string[];

  @Column({ type: 'int' })
  stock!: number;

  @Column({ default: '/clothes/onesie.svg' })
  image!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity('shop_customers')
export class ShopCustomer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  sellerId!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  province!: string;

  @Column()
  city!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
