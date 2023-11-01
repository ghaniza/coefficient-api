import { Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import * as ejs from 'ejs';
import * as path from 'path';
import { EMAIL_VIEW_PATH } from './email.constants';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  public async sendResetPasswordEmail(to: string, name: string, link: string) {
    const html = await ejs.renderFile(
      path.join(EMAIL_VIEW_PATH, 'reset-password.ejs'),
      { name, link },
    );

    const msg: sendgrid.MailDataRequired = {
      to,
      from: 'no-reply@ghanizadev.com',
      subject: 'Reset your password',
      html,
    };

    sendgrid.setApiKey(this.configService.getOrThrow('SENDGRID_API_KEY'));
    await sendgrid.send(msg);
  }

  public async sendAuthorizationCode(authorizationCode: string) {
    const to = this.configService.getOrThrow('ADMIN_EMAIL');

    const html = await ejs.renderFile(
      path.join(EMAIL_VIEW_PATH, 'authorization-code.ejs'),
      { authorizationCode },
    );

    const msg: sendgrid.MailDataRequired = {
      to,
      from: 'no-reply@ghanizadev.com',
      subject: 'Authorization code',
      html,
    };

    sendgrid.setApiKey(this.configService.getOrThrow('SENDGRID_API_KEY'));
    await sendgrid.send(msg);
  }
}
