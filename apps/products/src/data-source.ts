import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { Product } from './models/product';

config({ path: '.env.development' });

export const productsDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.PRODUCTS_DATABASE_URL,
  entities: [Product],
  migrations: ['apps/products/src/migrations/*.ts'],
});
