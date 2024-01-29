import { socketAsync } from '../../socket-init';

export const consumerTransportInit = async (device, consumerTransport = null) => {
  const data = await socketAsync('createWebRtcTransport', { forceTcp: false });

  if (data.error) {
    console.error(data.error);
    return;
  }

  consumerTransport = device.createRecvTransport(data);

  consumerTransport.on('connect', async ({ dtlsParameters }, cb, ecb) => {
    try {
      await socketAsync('connectTransport', { transportId: consumerTransport.id, dtlsParameters });
      cb();
    } catch (e) {
      ecb(e);
    }
  });

  consumerTransport.on('connectionstatechange', (state) => {
    if (state === 'failed') consumerTransport.close();
  });

  return consumerTransport;
}
