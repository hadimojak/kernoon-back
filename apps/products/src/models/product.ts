import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { SizeGuideRow } from '@app/contracts';

@Entity('products')
export class Product {
  @PrimaryColumn('uuid')
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

  @Column('simple-array', { default: '' })
  images!: string[];

  @Column()
  category!: string;

  @Column('simple-array')
  sizes!: string[];

  /** JSON array of per-size measurements for this garment. */
  @Column({ type: 'simple-json', nullable: true })
  sizeGuide!: SizeGuideRow[] | null;

  @Column('simple-array', { default: '' })
  colors!: string[];

  @Column({ type: 'varchar', default: '' })
  countryOfOrigin!: string;

  @Column({ type: 'int' })
  stock!: number;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'int' })
  position!: number;

  @Column()
  masterSellerId!: string;

  @Column()
  sellerId!: string;
}
