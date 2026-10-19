import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { Customer } from './models/customer';
import { MasterSeller } from './models/master-seller';
import { Seller } from './models/seller';

config({ path: '.env.development' });

export const identityDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.IDENTITY_DATABASE_URL,
  entities: [Customer, Seller, MasterSeller],
  migrations: ['apps/identity/src/migrations/*.ts'],
});
