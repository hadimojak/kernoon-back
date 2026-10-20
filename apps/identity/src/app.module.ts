import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('IDENTITY_DATABASE_URL'),
    HealthModule.forRoot('identity'),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
