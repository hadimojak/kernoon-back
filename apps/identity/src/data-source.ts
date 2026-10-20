import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { Customer } from './users/models/customer';
import { MasterSeller } from './users/models/master-seller';
import { Seller } from './users/models/seller';

config({ path: '.env.development' });

export const identityDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.IDENTITY_DATABASE_URL,
  entities: [Customer, Seller, MasterSeller],
  migrations: ['apps/identity/src/migrations/*.ts'],
});
