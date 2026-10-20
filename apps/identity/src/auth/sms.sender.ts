import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsSender {
  private readonly logger = new Logger(SmsSender.name);

  constructor(private readonly config: ConfigService) {}

  async sendCode(phone: string, code: string) {
    const apiKey = this.config.get<string>('KAVENEGAR_API_KEY');
    const sender = this.config.get<string>('KAVENEGAR_SENDER');
    if (!apiKey || !sender) {
      if (this.config.get<string>('NODE_ENV') === 'production') {
        throw new ServiceUnavailableException('SMS is not configured');
      }
      this.logger.log(`Development SMS code for ${phone} is ${code}`);
      return;
    }

    const body = new URLSearchParams({
      receptor: phone,
      sender,
      message: `کد ورود کرنون: ${code}`,
    });
    const response = await fetch(
      `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
      },
    );
    if (!response.ok) {
      throw new BadGatewayException('SMS provider rejected the message');
    }
  }
}
