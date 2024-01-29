import { socketAsync } from '../../socket-init';

export const getConsumerStream = async (device, consumerTransport, producerId) => {
  const { rtpCapabilities } = device;

  const { id, kind, rtpParameters } = await socketAsync('consume', {
    rtpCapabilities,
    consumerTransportId: consumerTransport.id, // might be
    producerId
  });

  const stream = new MediaStream();
  const consumer = await consumerTransport.consume({
    id,
    producerId,
    kind,
    rtpParameters,
    streamId: stream.id
  });
  stream.addTrack(consumer.track);

  return {
    consumer,
    stream,
    kind
  }
}
