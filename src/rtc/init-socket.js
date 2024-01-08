import { RoomService } from './services/room.service.js';
import { PeerService } from './services/peer.service.js';
import { getMediasoupWorker } from './services/worker.service.js';

export const socket = (io) => {
  const roomList = new Map();

  io.on('connection', (socket) => {
    socket.on('joinRoom', async ({ roomId, username }, cb) => {
      if (!roomList.has(roomId)) {
        const worker = await getMediasoupWorker();
        const room = new RoomService(roomId, worker, io);
        roomList.set(roomId, room);
        console.log('Created new room', { roomId, username });
      }

      console.log('User has joined the room', { roomId, username });

      const peer = new PeerService(socket.id, username);
      roomList.get(roomId).addPeer(peer);

      socket.roomId = roomId;

      cb(roomList.get(roomId).toJson());
    });

    socket.on('getProducers', () => {
      if (!roomList.has(socket.roomId)) return;

      console.log('Get producers', { username: roomList.get(socket.roomId).getPeers().get(socket.id).username });

      // Send all the current producer to newly joined member
      let producerList = roomList.get(socket.roomId).getProducerListForPeer();

      socket.emit('newProducers', producerList);
    });

    socket.on('getRouterRtpCapabilities', (_, cb) => {
      console.log('Get RouterRtpCapabilities', { username: roomList.get(socket.roomId).getPeers().get(socket.id).username });

      try {
        cb(roomList.get(socket.roomId).getRtpCapabilities());
      } catch (e) {
        cb({ error: e.message });
      }
    });

    socket.on('createWebRtcTransport', async (_, cb) => {
      console.log('Create webrtc transport', { username: roomList.get(socket.roomId).getPeers().get(socket.id).username });

      try {
        const { params } = await roomList.get(socket.roomId).createWebRtcTransport(socket.id);

        cb(params);
      } catch (err) {
        cb({ error: err.message });
      }
    });

    socket.on('connectTransport', async ({ transportId, dtlsParameters }, cb) => {
      console.log('Connect transport', { username: roomList.get(socket.roomId).getPeers().get(socket.id).username });

      if (!roomList.has(socket.roomId)) return;
      await roomList.get(socket.roomId).connectPeerTransport(socket.id, transportId, dtlsParameters);

      cb('success');
    });

    socket.on('produce', async ({ kind, rtpParameters, producerTransportId }, cb) => {
      if (!roomList.has(socket.roomId)) return cb({ error: 'not is a room' });

      let producerId = await roomList.get(socket.roomId).produce(socket.id, producerTransportId, rtpParameters, kind);

      console.log('Produce', {
        type: kind,
        username: roomList.get(socket.roomId).getPeers().get(socket.id).username,
        id: producerId
      });

      cb({ producerId });
    });

    socket.on('consume', async ({ consumerTransportId, producerId, rtpCapabilities }, cb) => {
      //TODO null handling
      let params = await roomList.get(socket.roomId).consume(socket.id, consumerTransportId, producerId, rtpCapabilities);

      console.log('Consuming', {
        username: roomList.get(socket.roomId).getPeers().get(socket.id).username,
        producerId: producerId,
        consumerId: params?.id
      });

      cb(params);
    });

    socket.on('getMyRoomInfo', (_, cb) => cb(roomList.get(socket.roomId).toJson()));

    socket.on('disconnect', async () => {
      if (!socket.roomId) return;

      console.log('Disconnect', { username: roomList.get(socket.roomId).getPeers().get(socket.id).username });

      await roomList.get(socket.roomId).removePeer(socket.id);
    });

    socket.on('producerClosed', (producerId) => {
      console.log('Producer close', { username: roomList.get(socket.roomId).getPeers().get(socket.id).username });

      roomList.get(socket.roomId).closeProducer(socket.id, producerId);
    });

    socket.on('exitRoom', async (_, cb) => {
      console.log('Exit room', { username: roomList.get(socket.roomId).getPeers().get(socket.id).username });

      if (!roomList.has(socket.roomId)) {
        cb({ error: 'Not currently in a room' });
        return;
      }

      // close transports
      await roomList.get(socket.roomId).removePeer(socket.id);

      if (roomList.get(socket.roomId).getPeers().size === 0) {
        roomList.delete(socket.roomId);
      }

      socket.roomId = null;

      cb('Successfully exited room');
    });
  });
}
