import { Customer } from './customer';
import { MasterSeller } from './master-seller';
import { Seller } from './seller';

export { UserAccount } from './user-account';
export { Customer } from './customer';
export { Seller } from './seller';
export { MasterSeller } from './master-seller';

export type IdentityUser = Customer | Seller | MasterSeller;
