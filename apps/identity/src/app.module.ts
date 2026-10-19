import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule, HealthModule } from '@app/common';
import { ProfileController } from './profile.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-only-change-me'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    HealthModule.forRoot('identity'),
  ],
  controllers: [UsersController, ProfileController],
  providers: [UsersService],
})
export class AppModule {}
