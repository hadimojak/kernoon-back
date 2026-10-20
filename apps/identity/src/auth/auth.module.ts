import { Module } from '@nestjs/common';
import { RedisModule } from '../infrastructure/redis.module';
import { UsersModule } from '../users/users.module';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { PhoneController } from './phone.controller';
import { PhoneCodeService } from './phone-code.service';
import { SmsSender } from './sms.sender';

@Module({
  imports: [RedisModule, UsersModule],
  controllers: [PhoneController, OauthController],
  providers: [SmsSender, PhoneCodeService, OauthService],
})
export class AuthModule {}
