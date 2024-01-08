import os from 'os';
import { config } from '../config.js';

export const settings = {
  // Worker settings
  CPU: os.availableParallelism(),
  worker: {
    rtcMinPort: 10_000,
    rtcMaxPort: 10_100,
    logLevel: 'warn',
    logTags: [ 'info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp', 'rtx', 'bwe', 'score', 'simulcast', 'svc' ]
  },

  // WebRtcTransport settings
  webRtcTransport: {
    listenIps: [ {
      ip: '0.0.0.0',
      announcedIp: config.PUBLIC_IP
    } ],
    maxIncomingBitrate: 1_500_000,
    initialAvailableOutgoingBitrate: 1_000_000
  },

  // Router settings
  router: {
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48_000,
        channels: 2
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90_000,
        parameters: {
          'x-google-start-bitrate': 1000
        }
      },
      {
        kind: 'video',
        mimeType: 'video/VP9',
        clockRate: 90_000,
        parameters: {
          'profile-id': 2,
          'x-google-start-bitrate': 1000
        }
      },
      {
        kind: 'video',
        mimeType: 'video/H264',
        clockRate: 90_000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '42e01f',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000
        }
      }
    ]
  }
}
