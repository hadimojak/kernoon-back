import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { Charge } from './models/charge';

config({ path: '.env.development' });

export const paymentsDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.PAYMENTS_DATABASE_URL,
  entities: [Charge],
  migrations: ['apps/payments/src/migrations/*.ts'],
});
