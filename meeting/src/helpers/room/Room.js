import { deviceLoad } from './device-load';
import { socket, socketAsync } from '../socket-init';
import { MediaTypes } from '../../constants/media-types';
import { removeConsumer } from './consumer/remove-consumer';
import { getConsumerStream } from './consumer/get-consumer-stream';
import { producerTransportInit } from './transports/producer-transport-init';
import { consumerTransportInit } from './transports/consumer-transport-init';

export class Room {
  #state;
  #device;
  #producer;
  #producerLabel;
  #consumers;
  #producers;
  #consumerTransport;
  #producerTransport;

  constructor(roomId, userId, state) {
    this.#state = state;
    this.#device = null;

    this.#producer = null;
    this.#producerLabel = new Map();

    this.#consumers = new Map();
    this.#producers = new Map();

    this.#consumerTransport = null;
    this.#producerTransport = null;

    (async () => {
      await this.#createRoom(roomId, userId);
    })();
  }

  #initTransports = async () => {
    try {
      const data = await socketAsync('getRouterRtpCapabilities');

      this.#device = await deviceLoad(data);

      this.#consumerTransport = await consumerTransportInit(this.#device);
      this.#producerTransport = await producerTransportInit(this.#device);

      socket.emit('getProducers');
    } catch (e) {
      console.error('Room joining error:', e);
    }
  }

  #consume = async (producerId) => {
    const { consumer, stream, kind } = await getConsumerStream(this.#device, this.#consumerTransport, producerId);

    this.#consumers.set(consumer.id, consumer);

    if (kind === 'video') {
      this.#state(prev => ({
        ...prev,
        remote: [ ...prev.remote, { id: consumer.id, video: stream } ]
      }));
    } else {
      this.#state(prev => ({
        ...prev,
        remote: [ ...prev.remote, { id: consumer.id, audio: stream } ]
      }));
    }

    consumer.on('trackended', () => removeConsumer(consumer.id, this.#consumers, this.#state));
    consumer.on('transportclose', () => removeConsumer(consumer.id, this.#consumers, this.#state));
  }

  #initSocket = () => {
    socket.on('consumerClosed', ({ consumerId }) => {
      removeConsumer(consumerId, this.#consumers, this.#state);
    });

    socket.on('newProducers', async (data) => {
      for (const { producerId } of data) {
        await this.#consume(producerId);
      }
    });

    socket.on('disconnect', async () => await this.exit(true));
  }

  #createRoom = async (roomId, userId) => {
    try {
      const room = await socketAsync('createRoom', { roomId, userId });
      console.log(room);

      await this.#initTransports();

      this.#initSocket();

      this.#state(prev => ({ ...prev, isOpen: true }));
    } catch (e) {
      console.error('Room creating error:', e);
    }
  }

  closeProducer = (type) => {
    if (!this.#producerLabel.has(type)) {
      console.log('There is no producer for this type ' + type);
      return;
    }

    const producerId = this.#producerLabel.get(type);

    socket.emit('producerClosed', producerId);

    this.#producers.get(producerId).close();
    this.#producers.delete(producerId);
    this.#producerLabel.delete(type);

    if (type !== MediaTypes.audio) {
      this.#state(prev => ({
        ...prev,
        local: [ ...prev.local.filter(item => {
          if (item.id !== producerId) return item;
          item.video.getTracks().forEach((track) => track.stop());
        }) ]
      }));
    }
  }

  produce = async (type, deviceId = null) => {
    let audio = false;
    let screen = false;
    let mediaConstraints = {}

    switch (type) {
      case MediaTypes.audio:
        mediaConstraints = {
          audio: { deviceId: deviceId },
          video: false
        }
        audio = true;
        break;
      case MediaTypes.video:
        mediaConstraints = {
          audio: false,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            deviceId: deviceId
          }
        }
        break;
      case MediaTypes.screen:
        screen = true;
        mediaConstraints = false;
        break;
      default:
        return;
    }

    if (!this.#device.canProduce('video') && !audio) {
      console.log('Cannot produce video');
      return;
    }

    if (this.#producerLabel.has(type)) {
      console.log('Producer already exists for this type:', type);
      return;
    }

    try {
      const stream = screen
        ? await navigator.mediaDevices.getDisplayMedia()
        : await navigator.mediaDevices.getUserMedia(mediaConstraints);

      const track = audio
        ? stream.getAudioTracks()[0]
        : stream.getVideoTracks()[0];

      const params = { track }

      if (!audio && !screen) {
        params.encodings = [
          {
            rid: 'r0',
            maxBitrate: 100000,
            //scaleResolutionDownBy: 10.0,
            scalabilityMode: 'S1T3'
          },
          {
            rid: 'r1',
            maxBitrate: 300000,
            scalabilityMode: 'S1T3'
          },
          {
            rid: 'r2',
            maxBitrate: 900000,
            scalabilityMode: 'S1T3'
          }
        ];

        params.codecOptions = {
          videoGoogleStartBitrate: 1000
        }
      }

      this.#producer = await this.#producerTransport.produce(params);

      this.#producers.set(this.#producer.id, this.#producer);

      if (!audio) {
        this.#state(prev => ({
          ...prev,
          local: [ ...prev.local, { id: this.#producer.id, video: stream } ]
        }));
      }

      this.#producer.on('trackended', () => {
        this.closeProducer(type);
      });

      const close = () => {
        if (!audio) {
          this.#state(prev => ({
            ...prev,
            local: [ ...prev.local.filter(item => {
              if (item.id !== this.#producer.id) return item;
              item.video.getTracks().forEach((track) => track.stop());
            }) ]
          }));
        }

        this.#producerLabel.delete(type);
        this.#producers.delete(this.#producer.id);
      }

      this.#producer.on('transportclose', () => {
        console.log('Producer transport close');
        close();
      });

      this.#producer.on('close', () => {
        console.log('Closing producer');
        close();
      });

      this.#producerLabel.set(type, this.#producer.id);
    } catch (e) {
      console.error('Produce error:', e);
    }
  }

  exit = async (offline = false) => {
    const clean = () => {
      this.#state(prev => ({ ...prev, isOpen: false }));

      this.#consumerTransport.close();
      this.#producerTransport.close();

      socket.off('disconnect');
      socket.off('newProducers');
      socket.off('consumerClosed');
    }

    if (!offline) {
      try {
        const d = await socketAsync('exitRoom');
        console.log(d);
      } catch (e) {
        console.error('Exit room error:', e);
      } finally {
        clean();
      }
    } else {
      clean();
    }
  }
}
