import dotenv from 'dotenv';

dotenv.config({ path: `.env.${ process.env.NODE_ENV }` });

export const env = {
  // Server
  PORT:               process.env.PORT,
  HOST:               process.env.HOST,
  DB_NAME:            process.env.DB_NAME,
  DB_URI:             process.env.DB_URI,
  DB_USER:            process.env.DB_USER,
  DB_PASS:            process.env.DB_PASS,
  JWT_ACCESS_SECRET:  process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  DEVELOPMENT:        process.env.NODE_ENV === 'development',
  // Mail Service
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  // Client App
  CLIENT_URL:          process.env.CLIENT_URL,
  CLIENT_ACTIVATE_URL: process.env.CLIENT_ACTIVATE_URL
}

const sanitize = (env) => {
  for (const variable in env) {
    if (!env[variable]) {
      if (!env.DEVELOPMENT) {
        throw new Error(`Error: Missing variable ${ variable } in environment.`);
      } else {
        console.warn(`Warning: Missing variable ${ variable } in environment.`);
      }
    }

    const value = env[variable];
    if (value && typeof value === 'string' && !isNaN(value)) env[variable] = Number(value);
  }

  return env;
}

export const config = sanitize(env);
