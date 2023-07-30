import dotenv from 'dotenv';

dotenv.config({ path: `.env.${ process.env.NODE_ENV }` });

const config = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  DB_NAME: process.env.DB_NAME,
  DB_URI: process.env.DB_URI,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  CLIENT_URL: process.env.CLIENT_URL,
  DEVELOPMENT: process.env.NODE_ENV === 'development'
}

export default config;
