import cors from 'cors';
import http from 'http';
import path from 'path';
import https from 'https';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookie from 'cookie-parser';
import { Server } from 'socket.io';
import { config } from './config.js';
import { dirname } from './utils/index.js';
import { routes } from './api/api.routes.js';
import { socket } from './rtc/init-socket.js';

let httpServer;
const app = express();

app.use(helmet());
app.use(cors({
  credentials: true,
  origin: config.CLIENT_URL
}));
app.use(cookie());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

routes(app);

try {
  await mongoose.connect(config.DB_URI, {
    dbName: config.DB_NAME,
    user: config.DB_USER,
    pass: config.DB_PASS
  });

  if (config.DEVELOPMENT) {
    httpServer = https.createServer(config.SSL, app);
  } else {
    app.use(express.static(path.join(dirname(import.meta.url), '../meeting', 'build')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(dirname(import.meta.url), '../meeting/build', 'index.html'));
    });

    httpServer = http.createServer(app);
  }

  httpServer.listen(config.PORT, () => {
    console.log('Running on port:', config.PORT);
  });

  const ServerIO = new Server(httpServer, {
    cors: {
      origin: config.CLIENT_URL
    }
  });

  socket(ServerIO);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
