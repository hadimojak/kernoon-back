import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceClient } from '@app/common';
import { Ticket } from './models/ticket';
import { TicketMessage } from './models/ticket-message';
import { TicketWidgetSetting } from './models/ticket-widget-setting';
import { TicketsController } from './tickets.controller';
import { TicketsGateway } from './tickets.gateway';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketMessage, TicketWidgetSetting]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-only-change-me'),
      }),
    }),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, TicketsGateway, ServiceClient],
})
export class TicketsModule {}
