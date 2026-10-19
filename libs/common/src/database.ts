import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import pg from 'pg';

export function databaseModule(urlEnvironmentKey: string) {
  return TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'postgres' as const,
      driver: pg,
      url: config.getOrThrow<string>(urlEnvironmentKey),
      autoLoadEntities: true,
      synchronize: false,
    }),
  });
}
