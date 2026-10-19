import { Column, Entity } from 'typeorm';
import { UserAccount } from './user-account';

@Entity('master_sellers')
export class MasterSeller extends UserAccount {
  readonly role = 'masterSeller' as const;
  readonly access = 'full' as const;

  @Column()
  businessName!: string;
}
