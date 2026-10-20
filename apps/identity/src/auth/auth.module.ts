import { Module } from '@nestjs/common';
import { RedisModule } from '../infrastructure/redis.module';
import { UsersModule } from '../users/users.module';
import { EmailController } from './email.controller';
import { EmailCodeService } from './email-code.service';
import { EmailSender } from './email.sender';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { PhoneController } from './phone.controller';
import { PhoneCodeService } from './phone-code.service';
import { SmsSender } from './sms.sender';

@Module({
  imports: [RedisModule, UsersModule],
  controllers: [PhoneController, EmailController, OauthController],
  providers: [SmsSender, EmailSender, PhoneCodeService, EmailCodeService, OauthService],
})
export class AuthModule {}
