import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { DeliveryAddress } from './models/delivery-address';
import { ShetabCard } from './models/shetab-card';

config({ path: '.env.development' });

export const accountDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.ACCOUNT_DATABASE_URL,
  entities: [DeliveryAddress, ShetabCard],
  migrations: ['apps/account/src/migrations/*.ts'],
});
