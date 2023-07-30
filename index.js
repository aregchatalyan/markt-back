import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookie from 'cookie-parser';
import config from './config.js';

const app = express();

app.use(cors());
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

await mongoose.connect(config.DB_URI, {
  dbName: config.DB_NAME,
  user: config.DB_USER,
  pass: config.DB_PASS
});

const server = http.createServer(app);

server.listen(config.PORT, config.HOST, () => {
  console.log(`Running on http://localhost:${ config.PORT }`);
});
