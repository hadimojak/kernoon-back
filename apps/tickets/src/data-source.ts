import { config } from 'dotenv';
import pg from 'pg';
import { DataSource } from 'typeorm';
import { Ticket } from './models/ticket';
import { TicketMessage } from './models/ticket-message';
import { TicketWidgetSetting } from './models/ticket-widget-setting';

config({ path: '.env.development' });

const ticketsDataSource = new DataSource({
  type: 'postgres',
  driver: pg,
  url: process.env.TICKETS_DATABASE_URL,
  entities: [Ticket, TicketMessage, TicketWidgetSetting],
  migrations: ['apps/tickets/src/migrations/*.ts'],
});

export default ticketsDataSource;
