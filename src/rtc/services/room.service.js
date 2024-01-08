import { settings } from '../settings.js';

export class RoomService {
  constructor(roomId, worker, io) {
    this.id = roomId;

    const { mediaCodecs } = settings.router;

    worker.createRouter({ mediaCodecs })
      .then(function (router) {
          this.router = router
        }.bind(this)
      );

    this.peers = new Map();
    this.io = io;
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

    transport.on('dtlsstatechange', function (dtlsState) {
        if (dtlsState === 'closed') {
          console.log('Transport close', { username: this.peers.get(socketId).username });
          transport.close();
        }
      }.bind(this)
    );

    transport.on('close', () => console.log('Transport close', { username: this.peers.get(socketId).username }));

    console.log('Adding transport', { transportId: transport.id });

    this.peers.get(socketId).addTransport(transport);

    return {
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters
      }
    };
  }

  async connectPeerTransport(socketId, transportId, dtlsParameters) {
    if (!this.peers.has(socketId)) return;

    await this.peers.get(socketId).connectTransport(transportId, dtlsParameters);
  }

  async produce(socketId, producerTransportId, rtpParameters, kind) {
    // handle undefined errors
    return new Promise(
      async function (resolve, reject) {
        let producer = await this.peers.get(socketId).createProducer(producerTransportId, rtpParameters, kind);

        resolve(producer.id);

        this.broadCast(socketId, 'newProducers', [
          {
            producerId: producer.id,
            producerSocketId: socketId
          }
        ]);
      }.bind(this)
    );
  }

  async consume(socketId, consumerTransportId, producerId, rtpCapabilities) {
    // handle nulls
    if (!this.router.canConsume({ producerId: producerId, rtpCapabilities })) {
      console.error('Can not consume');
      return;
    }

    let { consumer, params } = await this.peers
      .get(socketId)
      .createConsumer(consumerTransportId, producerId, rtpCapabilities);

    consumer.on('producerclose', function () {
        console.log('Consumer closed due to producerclose event', {
          username: `${ this.peers.get(socketId).username }`,
          consumerId: `${ consumer.id }`
        });

        this.peers.get(socketId).removeConsumer(consumer.id);

        // tell client consumer is dead
        this.io.to(socketId).emit('consumerClosed', { consumerId: consumer.id });
      }.bind(this)
    );

    return params;
  }

  async removePeer(socketId) {
    this.peers.get(socketId).close();
    this.peers.delete(socketId);
  }

  closeProducer(socketId, producerId) {
    this.peers.get(socketId).closeProducer(producerId);
  }

  broadCast(socketId, username, data) {
    for (let otherID of Array.from(this.peers.keys()).filter((id) => id !== socketId)) {
      this.send(otherID, username, data);
    }
  }

  send(socketId, username, data) {
    this.io.to(socketId).emit(username, data);
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
