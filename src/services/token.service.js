import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { TokenModel } from '../models/token/token.model.js';

export class TokenService {
  static generateTokens(payload) {
    return {
      access_token:  jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '1d' }),
      refresh_token: jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    }
  }

  static validateAccessToken(access_token) {
    try {
      return jwt.verify(access_token, config.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }

  static validateRefreshToken(refresh_token) {
    try {
      return jwt.verify(refresh_token, config.JWT_REFRESH_SECRET);
    } catch (e) {
      return null;
    }
  }

  static async saveRefreshToken(user_id, refresh_token) {
    const candidate = await TokenModel.findOne({ user: user_id });
    if (candidate) {
      candidate.refresh_token = refresh_token;
      return candidate.save();
    }

    return TokenModel.create({ user: user_id, refresh_token });
  }

  static async removeRefreshToken(refresh_token) {
    return TokenModel.findOneAndDelete({ refresh_token });
  }

  static async findRefreshToken(refresh_token) {
    return TokenModel.findOne({ refresh_token });
  }
}
