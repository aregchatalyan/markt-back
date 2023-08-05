import fs from 'fs';
import cors from 'cors';
import http from 'http';
import https from 'https';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookie from 'cookie-parser';

import config from './config.js';
import { auth } from './api/api.routes.js';
import { errorHandler, send } from './api/api.middlewares.js';

const app = express();

app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.DEVELOPMENT) app.use(morgan('dev'));

app.use(send);
app.use('/api', auth);
app.use(errorHandler);

const server = config.DEVELOPMENT
  ? https.createServer({
    key: await fs.promises.readFile(new URL('./ssl/key.pem', import.meta.url)),
    cert: await fs.promises.readFile(new URL('./ssl/cert.pem', import.meta.url))
  }, app)
  : http.createServer(app);

try {
  await mongoose.connect(config.DB_URI, {
    dbName: config.DB_NAME,
    user: config.DB_USER,
    pass: config.DB_PASS
  });

  server.listen(+config.PORT, config.HOST, () => {
    console.log(`Running on https://${ config.HOST }:${ config.PORT }`);
  });
} catch (e) {
  console.error(e.message);
}
