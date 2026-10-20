import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { Basket, BasketItem } from './models/basket';

config({ path: '.env.development' });

export const cartDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.CART_DATABASE_URL,
  entities: [Basket, BasketItem],
  migrations: ['apps/cart/src/migrations/*.ts'],
});
