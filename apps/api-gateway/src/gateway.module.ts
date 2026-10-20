import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServiceClient } from '@app/common';
import { GatewayService } from './gateway.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-only-change-me'),
      }),
    }),
  ],
  providers: [ServiceClient, GatewayService],
  exports: [JwtModule, ServiceClient, GatewayService],
})
export class GatewayModule {}
