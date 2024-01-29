import { RoomService } from './services/room.service.js';
import { PeerService } from './services/peer.service.js';
import { getMediasoupWorker } from './services/worker.service.js';

export const socket = (io) => {
  const roomList = new Map();

  io.on('connection', (socket) => {
    socket.on('createRoom', async ({ roomId, userId }, cb) => {
      if (!roomList.has(roomId)) {
        console.log('Creating room:', { roomId });

        const worker = await getMediasoupWorker();
        roomList.set(roomId, new RoomService(roomId, worker, io));

        cb(`Created room: ${ roomId }`);
      }

      roomList.get(roomId).addPeer(new PeerService(socket.id, userId));

      socket.roomId = roomId;

      cb(roomList.get(roomId).toJson());
    });

    socket.on('getProducers', () => {
      if (!roomList.has(socket.roomId)) return;

      let producerList = roomList.get(socket.roomId).getProducerListForPeer();

      socket.emit('newProducers', producerList);
    });

    socket.on('getRouterRtpCapabilities', (_, cb) => {
      try {
        cb(roomList.get(socket.roomId).getRtpCapabilities());
      } catch (e) {
        cb({ error: e.message });
      }
    });

    socket.on('createWebRtcTransport', async (_, cb) => {
      try {
        const { params } = await roomList.get(socket.roomId).createWebRtcTransport(socket.id);

        cb(params);
      } catch (err) {
        cb({ error: err.message });
      }
    });

    socket.on('connectTransport', async ({ transportId, dtlsParameters }, cb) => {
      if (!roomList.has(socket.roomId)) return;
      await roomList.get(socket.roomId).connectPeerTransport(socket.id, transportId, dtlsParameters);

      cb('success');
    });

    socket.on('produce', async ({ kind, rtpParameters, producerTransportId }, cb) => {
      if (!roomList.has(socket.roomId)) return cb({ error: 'not is a room' });

      let producerId = await roomList.get(socket.roomId).produce(socket.id, producerTransportId, rtpParameters, kind);

      cb({ producerId });
    });

    socket.on('consume', async ({ consumerTransportId, producerId, rtpCapabilities }, cb) => {
      let params = await roomList.get(socket.roomId).consume(socket.id, consumerTransportId, producerId, rtpCapabilities);

      cb(params);
    });

    socket.on('getMyRoomInfo', (_, cb) => cb(roomList.get(socket.roomId).toJson()));

    socket.on('disconnect', async () => {
      if (!socket.roomId) return;

      await roomList.get(socket.roomId).removePeer(socket.id);
    });

    socket.on('producerClosed', (producerId) => {
      roomList.get(socket.roomId).closeProducer(socket.id, producerId);
    });

    socket.on('exitRoom', async (_, cb) => {
      if (!roomList.has(socket.roomId)) {
        cb({ error: 'Not currently in a room' });
        return;
      }

      await roomList.get(socket.roomId).removePeer(socket.id);

      if (roomList.get(socket.roomId).getPeers().size === 0) {
        roomList.delete(socket.roomId);
      }

      socket.roomId = null;

      cb('Successfully exited room');
    });
  });
}
