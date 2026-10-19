import { Column, Entity } from 'typeorm';
import { UserAccount } from './user-account';

@Entity('sellers')
export class Seller extends UserAccount {
  readonly role = 'seller' as const;

  @Column()
  masterSellerId!: string;
}
