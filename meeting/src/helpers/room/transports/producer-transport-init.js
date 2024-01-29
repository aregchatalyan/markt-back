import { socketAsync } from '../../socket-init';

export const producerTransportInit = async (device, producerTransport = null) => {
  const data = await socketAsync('createWebRtcTransport', {
    forceTcp: false,
    rtpCapabilities: device.rtpCapabilities
  });

  if (data.error) {
    console.error(data.error);
    return;
  }

  producerTransport = device.createSendTransport(data);

  producerTransport.on('connect', async ({ dtlsParameters }, cb, ecb) => {
    try {
      await socketAsync('connectTransport', { dtlsParameters, transportId: data.id });
      cb();
    } catch (e) {
      ecb(e);
    }
  });

  producerTransport.on('produce', async ({ kind, rtpParameters }, cb, ecb) => {
    try {
      const { producerId } = await socketAsync('produce', {
        producerTransportId: producerTransport.id,
        kind,
        rtpParameters
      });

      cb({ id: producerId });
    } catch (e) {
      ecb(e);
    }
  });

  producerTransport.on('connectionstatechange', (state) => {
    if (state === 'failed') producerTransport.close();
  });

  return producerTransport;
}
