import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookie from 'cookie-parser';

import './utils/__dirname.js';
import config from './config.js';

const app = express();

app.use(cookie());
app.use(cors({ credentials: true, origin: config.CLIENT_URL, methods: 'GET,HEAD,OPTIONS,PUT,POST,DELETE' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

if (config.DEVELOPMENT) {
  app.use(morgan('dev'));
}

global.app = app;
await import('./api/api.routes.js');

const server = http.createServer(app);

try {
  await mongoose.connect(config.DB_URI, { dbName: config.DB_NAME, user: config.DB_USER, pass: config.DB_PASS });
  console.log('MongoDB connected');

  server.listen(+config.PORT, config.HOST, () => {
    console.log(`Running on http://${ config.HOST }:${ config.PORT }`);
  });
} catch (e) {
  console.error(e.message);
}
