import * as mediasoup from 'mediasoup-client';

export const deviceLoad = async (routerRtpCapabilities) => {
  try {
    const device = new mediasoup.Device();
    await device.load({ routerRtpCapabilities });

    return device;
  } catch (e) {
    if (e.name === 'UnsupportedError') console.error('Browser not supported');
    console.error(e);
  }
}
