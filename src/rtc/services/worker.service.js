import mediasoup from 'mediasoup';
import { settings } from '../settings.js';

const workers = [];
let nextMediasoupWorkerIdx = 0;

for (let thread = 1; thread <= settings.CPU; thread++) {
  const worker = await mediasoup.createWorker({
    logLevel: settings.worker.logLevel,
    logTags: settings.worker.logTags,
    rtcMinPort: settings.worker.rtcMinPort,
    rtcMaxPort: settings.worker.rtcMaxPort
  });

  worker.on('died', () => {
    console.error('mediasoupInit worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
    setTimeout(() => process.exit(1), 2000);
  });

  workers.push(worker);
}

export const getMediasoupWorker = () => {
  const worker = workers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;

  return worker;
}
