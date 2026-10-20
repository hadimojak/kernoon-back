import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailSender {
  private readonly logger = new Logger(EmailSender.name);

  constructor(private readonly config: ConfigService) {}

  async sendCode(email: string, code: string) {
    const host = this.config.get<string>('SMTP_HOST');
    if (!host) {
      if (this.config.get<string>('NODE_ENV') === 'production') {
        throw new ServiceUnavailableException('Email is not configured');
      }
      this.logger.log(`Development email code for ${email} is ${code}`);
      return;
    }

    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    const transport = nodemailer.createTransport({
      host,
      port: Number(this.config.get<string>('SMTP_PORT') ?? 587),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: user ? { user, pass } : undefined,
    });

    try {
      await transport.sendMail({
        from:
          this.config.get<string>('SMTP_FROM') ??
          'Kernoon <no-reply@kernoon.ir>',
        to: email,
        subject: 'Kernoon login code',
        text: `کد ورود کرنون: ${code}`,
      });
    } catch {
      throw new BadGatewayException('Email provider rejected the message');
    }
  }
}
