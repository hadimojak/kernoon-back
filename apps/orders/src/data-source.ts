import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { ShopOrder, ShopOrderItem } from './models/shop-order';

config({ path: '.env.development' });

export const ordersDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.ORDERS_DATABASE_URL,
  entities: [ShopOrder, ShopOrderItem],
  migrations: ['apps/orders/src/migrations/*.ts'],
});
