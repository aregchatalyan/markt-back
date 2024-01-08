import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { TokenModel } from '../models/token/token.model.js';

export class TokenService {
  static generateTokens(payload) {
    return {
      accessToken: jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '1d' }),
      refreshToken: jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    }
  }

  static validateAccessToken(accessToken) {
    try {
      return jwt.verify(accessToken, config.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }

  static validateRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    } catch (e) {
      return null;
    }
  }

  static async saveRefreshToken(user_id, refreshToken) {
    const candidate = await TokenModel.findOne({ user: user_id });
    if (candidate) {
      candidate.refreshToken = refreshToken;
      return candidate.save();
    }

    return TokenModel.create({ user: user_id, refreshToken });
  }

  static async removeRefreshToken(refreshToken) {
    return TokenModel.findOneAndDelete({ refreshToken });
  }

  static async findRefreshToken(refreshToken) {
    return TokenModel.findOne({ refreshToken });
  }
}
