import jwt from 'jsonwebtoken';
import config from '../config.js';
import TokenModel from '../models/token/token.model.js';

class TokenService {
  generateTokens(payload) {
    return {
      access_token: jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '1d' }),
      refresh_token: jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    }
  }

  validateAccessToken(access_token) {
    try {
      return jwt.verify(access_token, config.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(refresh_token) {
    try {
      return jwt.verify(refresh_token, config.JWT_REFRESH_SECRET);
    } catch (e) {
      return null;
    }
  }

  async saveRefreshToken(user_id, refresh_token) {
    const candidate = await TokenModel.findOne({ user: user_id });
    if (candidate) {
      candidate.refresh_token = refresh_token;
      return candidate.save();
    }

    return TokenModel.create({ user: user_id, refresh_token });
  }

  async removeRefreshToken(refresh_token) {
    return TokenModel.findOneAndDelete({ refresh_token });
  }

  async findRefreshToken(refresh_token) {
    return TokenModel.findOne({ refresh_token });
  }
}

export default new TokenService();
