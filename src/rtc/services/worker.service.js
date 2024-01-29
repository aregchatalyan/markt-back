import os from 'node:os';
import mediasoup from 'mediasoup';
import { settings } from '../settings.js';

const workers = os.cpus().map(async () => {
  const worker = await mediasoup.createWorker({
    logLevel: settings.worker.logLevel,
    logTags: settings.worker.logTags,
    rtcMinPort: settings.worker.rtcMinPort,
    rtcMaxPort: settings.worker.rtcMaxPort
  });

  worker.on('died', () => {
    setTimeout(() => process.exit(1), 2000);
  });

  return worker;
});

let workerIndex = 0;

export const getMediasoupWorker = () => {
  const worker = workers[workerIndex];

  if (++workerIndex === workers.length) workerIndex = 0;

  return worker;
}
