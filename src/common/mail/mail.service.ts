import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';
import { ErrorHender } from 'src/common/utils/error-handle';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter<SentMessageInfo, Options>;
  
    constructor() {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: String(process.env.SMTP_USER),
          pass: String(process.env.SMTP_PASS),
        },
      });
    }
  
    async sendMail(to: string, subject: string, text: string) {
      try {
        const message = await this.transporter.sendMail({
  
          from: String(process.env.SMTP_USER),
          to,
          subject,
          html: text
         
        });
        return message;
      } catch (error) {
        return ErrorHender(error);
      }
    }
  }