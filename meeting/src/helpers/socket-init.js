import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL;

export const socket = io(API_URL, {
  secure: true,
  transports: [ 'websocket', 'polling' ]
});

socket.on('connect_error', () => {
  socket.io.opts.transports = [ 'polling', 'websocket' ];
  socket.io.opts.upgrade = true;
});

export const socketAsync = (type, payload = {}) => {
  return new Promise((resolve, reject) => {
    socket.emit(type, payload, (data) => {
      data.error ? reject(data.error) : resolve(data);
    });
  });
}
