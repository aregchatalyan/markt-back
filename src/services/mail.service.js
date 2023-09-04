import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { config } from '../config.js';
import { dirname } from '../utils/index.js';

export class MailService {
  static #transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    }
  });

  static async sendMail({ to, from = config.SMTP_USER, template, subject = 'Markt Store', payload }) {
    try {
      const root = path.join(dirname(import.meta.url), '../');

      const template_file = await fs.promises.readFile(`${ root }/public/templates/${ template }.hbs`, 'utf-8');

      const html = handlebars.compile(template_file)(payload);

      await this.#transporter.sendMail({ subject, from, to, html });
    } catch (e) {
      console.error(e.message);
    }
  }
}
