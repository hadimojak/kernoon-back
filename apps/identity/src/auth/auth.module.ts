import { Module } from '@nestjs/common';
import { RedisModule } from '../infrastructure/redis.module';
import { UsersModule } from '../users/users.module';
import { EmailController } from './email.controller';
import { EmailCodeService } from './email-code.service';
import { EmailSender } from './email.sender';
import { PhoneController } from './phone.controller';
import { PhoneCodeService } from './phone-code.service';
import { SellerOtpController } from './seller-otp.controller';
import { SmsSender } from './sms.sender';

@Module({
  imports: [RedisModule, UsersModule],
  controllers: [PhoneController, EmailController, SellerOtpController],
  providers: [SmsSender, EmailSender, PhoneCodeService, EmailCodeService],
})
export class AuthModule {}
