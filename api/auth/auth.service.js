import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from '../../config.js';
import ApiError from '../api.error.js';
import apiMessages from '../api.messages.js';
import UserDto from '../../models/user/user.dto.js';
import UserModel from '../../models/user/user.model.js';
import tokenService from '../../services/token.service.js';
import mailService from '../../services/mail.service.js';

const { USER_MESSAGE } = apiMessages;

class AuthService {
  async signUp(dto) {
    const candidate = await UserModel.findOne({ email: dto.email });
    if (candidate) throw ApiError.Conflict(USER_MESSAGE.ALREADY_EXISTS);

    const salt = await bcrypt.genSalt(10);
    dto.password = await bcrypt.hash(dto.password, salt);
    dto.secret = crypto.randomBytes(4).toString('hex');

    const user = await UserModel.create(dto);

    await mailService.sendMail({
      to: user.email,
      template: 'user-activate',
      payload: {
        link: `${ config.CLIENT_ACTIVATE_URL }/${ user.secret }`
      }
    });

    return new UserDto(user).get();
  }

  async activate(secret) {
    const user = await UserModel.findOneAndUpdate({ secret }, { $unset: { secret: true }, active: true });
    if (!user) throw ApiError.BadRequest(USER_MESSAGE.INCORRECT_ACTIVATION_LINK);
  }

  async signIn(dto) {
    const user = await UserModel.findOne({ email: dto.email });
    if (!user) throw ApiError.NotFound(USER_MESSAGE.NOT_FOUND_EMAIL);

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw ApiError.BadRequest(USER_MESSAGE.WRONG_CREDENTIALS);

    const user_data = new UserDto(user).get();

    const tokens = tokenService.generateTokens(user_data);
    await tokenService.saveRefreshToken(user_data.id, tokens.refresh_token);

    return { ...user_data, ...tokens };
  }

  async logout(refresh_token) {
    return tokenService.removeRefreshToken(refresh_token);
  }

  async refresh(refresh_token) {
    if (!refresh_token) throw ApiError.Unauthorized();

    const token_user = tokenService.validateRefreshToken(refresh_token);
    const db_token = await tokenService.findRefreshToken(refresh_token);
    if (!token_user || !db_token) throw ApiError.Unauthorized();

    const user = await UserModel.findById(token_user.id);
    const user_data = new UserDto(user).get();

    const tokens = tokenService.generateTokens({ ...user_data });
    await tokenService.saveRefreshToken(user_data.id, tokens.refresh_token);

    return { ...user_data, ...tokens };
  }
}

export default new AuthService();
