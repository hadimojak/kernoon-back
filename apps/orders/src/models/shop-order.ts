import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type StoredAddress = {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
  plaque: string;
  unit: string;
};

export type StoredPayment = {
  id: string;
  bank: string;
  last4: string;
};

@Entity('shop_orders')
export class ShopOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ default: 'placed' })
  status!: string;

  @Column({ type: 'int' })
  totalUsd!: number;

  @Column({ type: 'int' })
  totalToman!: number;

  @Column({ type: 'jsonb' })
  address!: StoredAddress;

  @Column({ type: 'jsonb' })
  payment!: StoredPayment;

  @OneToMany(() => ShopOrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items!: ShopOrderItem[];

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity('shop_order_items')
export class ShopOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ShopOrder, (order) => order.items, { onDelete: 'CASCADE' })
  order!: ShopOrder;

  @Column()
  productId!: string;

  @Column()
  name!: string;

  @Column()
  size!: string;

  @Column()
  tier!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'int' })
  unitPriceUsd!: number;

  @Column({ type: 'int' })
  unitPriceToman!: number;

  @Column({ type: 'int' })
  lineUsd!: number;

  @Column({ type: 'int' })
  lineToman!: number;
}
