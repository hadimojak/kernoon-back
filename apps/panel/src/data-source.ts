import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { Listing, ShopCustomer } from './models/shop';

config({ path: '.env.development' });

export const panelDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.PANEL_DATABASE_URL,
  entities: [Listing, ShopCustomer],
  migrations: ['apps/panel/src/migrations/*.ts'],
});
