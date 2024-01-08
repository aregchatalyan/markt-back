export class PeerService {
  constructor(socketId, username) {
    this.id = socketId;
    this.username = username;
    this.transports = new Map();
    this.consumers = new Map();
    this.producers = new Map();
  }

  addTransport(transport) {
    this.transports.set(transport.id, transport);
  }

  async connectTransport(transportId, dtlsParameters) {
    if (!this.transports.has(transportId)) return;

    await this.transports.get(transportId).connect({ dtlsParameters });
  }

  async createProducer(producerTransportId, rtpParameters, kind) {
    //TODO handle null errors
    const producer = await this.transports.get(producerTransportId).produce({ kind, rtpParameters });

    this.producers.set(producer.id, producer);

    producer.on('transportclose', function () {
        console.log('Producer transport close', { username: `${ this.username }`, consumerId: `${ producer.id }` });
        producer.close();
        this.producers.delete(producer.id);
      }.bind(this)
    );

    return producer;
  }

  async createConsumer(consumerTransportId, producerId, rtpCapabilities) {
    let consumerTransport = this.transports.get(consumerTransportId);

    let consumer = null;

    try {
      consumer = await consumerTransport.consume({
        producerId: producerId,
        paused: false, //producer.kind === 'video',
        rtpCapabilities
      });
    } catch (e) {
      console.error('Consume failed', e);
      return;
    }

    if (consumer.type === 'simulcast') {
      await consumer.setPreferredLayers({
        spatialLayer: 2,
        temporalLayer: 2
      });
    }

    this.consumers.set(consumer.id, consumer);

    consumer.on('transportclose',
      function () {
        console.log('Consumer transport close', { username: `${ this.username }`, consumerId: `${ consumer.id }` });

        this.consumers.delete(consumer.id);
      }.bind(this)
    );

    return {
      consumer,
      params: {
        producerId: producerId,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused
      }
    }
  }

  closeProducer(producerId) {
    try {
      this.producers.get(producerId).close();
    } catch (e) {
      console.warn(e);
    }

    this.producers.delete(producerId);
  }

  getProducer(producerId) {
    return this.producers.get(producerId)
  }

  close() {
    this.transports.forEach((transport) => transport.close());
  }

  removeConsumer(consumerId) {
    this.consumers.delete(consumerId);
  }
}
