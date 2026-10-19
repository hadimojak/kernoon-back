import { Entity } from 'typeorm';
import { UserAccount } from './user-account';

@Entity('customers')
export class Customer extends UserAccount {
  readonly role = 'customer' as const;
}
