import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { SellerApplication } from './models/seller-application';

config({ path: '.env.development' });

export const sellersDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.SELLERS_DATABASE_URL,
  entities: [SellerApplication],
  migrations: ['apps/sellers/src/migrations/*.ts'],
});
