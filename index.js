import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookie from 'cookie-parser';
import config from './config.js';
import routes from './api/api.routes.js';

const app = express();
const { PORT, HOST, DB_URI, DB_NAME, DB_USER, DB_PASS, DEVELOPMENT } = config;

app.use(cors());
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (DEVELOPMENT) app.use(morgan('dev'));

app.use('/', routes);

const server = http.createServer(app);

try {
  await mongoose.connect(DB_URI, {
    dbName: DB_NAME,
    user: DB_USER,
    pass: DB_PASS
  });

  server.listen(PORT, HOST);

  server.on('listening', () => {
    console.log(`Running on http://localhost:${ PORT }`);
  });

  server.on('error', (e) => {
    console.error(e) ;
  });
} catch (e) {
  console.error(e.message);
}
