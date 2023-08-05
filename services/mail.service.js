import fs from 'fs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import config from '../config.js';

class MailService {
  #transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    }
  });

  async sendMail(to, template, payload) {
    try {
      const file_path = new URL(`../public/templates/${ template }.hbs`, import.meta.url);
      const template_file = await fs.promises.readFile(file_path, { encoding: 'utf-8' });
      const compiledTemplate = handlebars.compile(template_file);
      const html = compiledTemplate(payload);

      await this.#transporter.sendMail({
        subject: payload.subject || 'Markt Store',
        from: config.SMTP_USER,
        to,
        html
      });
    } catch (e) {
      console.error(e.message);
    }
  }
}

export default new MailService();
