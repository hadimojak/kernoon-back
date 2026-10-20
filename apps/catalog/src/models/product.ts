import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  nameFa!: string;

  @Column({ type: 'int' })
  usd!: number;

  @Column({ type: 'int' })
  toman!: number;

  @Column()
  image!: string;

  @Column()
  category!: string;

  @Column('simple-array')
  sizes!: string[];

  @Column({ type: 'int' })
  stock!: number;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'int' })
  position!: number;
}
