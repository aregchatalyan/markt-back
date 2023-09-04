import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookie from 'cookie-parser';
import { config } from './config.js';
import { routes } from './api/api.routes.js';

const app = express();

app.use(cors({
  credentials: true,
  origin: config.CLIENT_URL
}));

app.use(cookie());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

if (config.DEVELOPMENT) {
  app.use(morgan('dev'));
}

routes(app);

try {
  await mongoose.connect(config.DB_URI, {
    dbName: config.DB_NAME,
    user: config.DB_USER,
    pass: config.DB_PASS
  });
  console.log('MongoDB connected.');

  app.listen(+config.PORT, config.HOST, () => {
    console.log(`Running on http://${ config.HOST }:${ config.PORT }`);
  });
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
