import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { Product } from './models/product';

config({ path: '.env.development' });

export const catalogDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.CATALOG_DATABASE_URL,
  entities: [Product],
  migrations: ['apps/catalog/src/migrations/*.ts'],
});
