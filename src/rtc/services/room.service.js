import { settings } from '../settings.js';

export class RoomService {
  constructor(roomId, worker, io) {
    this.id = roomId;

    worker.createRouter({ mediaCodecs: settings.mediaCodecs })
      .then((router) => this.router = router);

    this.io = io;
    this.peers = new Map();
  }

  addPeer(peer) {
    this.peers.set(peer.id, peer);
  }

  getProducerListForPeer() {
    let producerList = [];

    this.peers.forEach((peer) => {
      peer.producers.forEach((producer) => {
        producerList.push({ producerId: producer.id });
      });
    });

    return producerList;
  }

  getRtpCapabilities() {
    return this.router.rtpCapabilities;
  }

  async createWebRtcTransport(socketId) {
    const { maxIncomingBitrate, initialAvailableOutgoingBitrate } = settings.webRtcTransport;

    const transport = await this.router.createWebRtcTransport({
      listenIps: settings.webRtcTransport.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate
    });

    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (e) {
        console.warn(e);
      }
    }

    transport.on('dtlsstatechange', (dtlsState) => {
      if (dtlsState === 'closed') transport.close();
    });

    transport.on('close', () => {
      console.log('Transport close', { userId: this.peers.get(socketId).userId });
    });

    this.peers.get(socketId).addTransport(transport);

    return {
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters
      }
    }
  }

  async connectPeerTransport(socketId, transportId, dtlsParameters) {
    if (!this.peers.has(socketId)) return;

    await this.peers.get(socketId).connectTransport(transportId, dtlsParameters);
  }

  async produce(socketId, producerTransportId, rtpParameters, kind) {
    return new Promise(async (resolve, reject) => {
      let producer = await this.peers.get(socketId).createProducer(producerTransportId, rtpParameters, kind);

      resolve(producer.id);

      this.broadCast(socketId, 'newProducers', [ {
        producerId: producer.id,
        producerSocketId: socketId
      } ]);
    });
  }

  async consume(socketId, consumerTransportId, producerId, rtpCapabilities) {
    if (!this.router.canConsume({ producerId: producerId, rtpCapabilities })) {
      console.error('Can not consume');
      return;
    }

    let { consumer, params } = await this.peers
      .get(socketId)
      .createConsumer(consumerTransportId, producerId, rtpCapabilities);

    consumer.on('producerclose', () => {
      this.peers.get(socketId).removeConsumer(consumer.id);

      this.io.to(socketId).emit('consumerClosed', { consumerId: consumer.id });
    });

    return params;
  }

  async removePeer(socketId) {
    this.peers.get(socketId).close();
    this.peers.delete(socketId);
  }

  closeProducer(socketId, producerId) {
    this.peers.get(socketId).closeProducer(producerId);
  }

  broadCast(socketId, userId, data) {
    for (let otherID of Array.from(this.peers.keys()).filter((id) => id !== socketId)) {
      this.send(otherID, userId, data);
    }
  }

  send(socketId, userId, data) {
    this.io.to(socketId).emit(userId, data);
  }

  getPeers() {
    return this.peers;
  }

  toJson() {
    return {
      id: this.id,
      peers: JSON.stringify([ ...this.peers ])
    }
  }
}
