import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('baskets')
export class Basket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  ownerId!: string;

  @OneToMany(() => BasketItem, (item) => item.basket, { cascade: true })
  items!: BasketItem[];
}

@Entity('basket_items')
export class BasketItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Basket, (basket) => basket.items, { onDelete: 'CASCADE' })
  basket!: Basket;

  @Column()
  productId!: string;

  @Column()
  size!: string;

  @Column()
  tier!: string;

  @Column({ type: 'int' })
  quantity!: number;
}
