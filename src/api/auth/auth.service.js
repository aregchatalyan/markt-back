import bcrypt from 'bcrypt';
import { config } from '../../config.js';
import { ApiError } from '../api.error.js';
import { apiMessages } from '../api.messages.js';
import { UserDto } from '../../models/user/user.dto.js';
import { UserModel } from '../../models/user/user.model.js';
import { MailService } from '../../services/mail.service.js';
import { TokenService } from '../../services/token.service.js';
import { randomBytes } from '../../utils/index.js';

const { USER_MESSAGE } = apiMessages;

export class AuthService {
  static async signUp(dto) {
    const candidate = await UserModel.findOne({ email: dto.email });
    if (candidate) throw ApiError.Conflict(USER_MESSAGE.ALREADY_EXISTS);

    const salt = await bcrypt.genSalt(10);
    dto.password = await bcrypt.hash(dto.password, salt);
    dto.secret = randomBytes(8);

    const user = await UserModel.create(dto);

    await MailService.sendMail({
      to: user.email,
      template: 'user-activate',
      payload: {
        link: `${ config.CLIENT_ACTIVATE_URL }/${ user.secret }`
      }
    });

    return new UserDto(user).get();
  }

  static async activate(secret) {
    const user = await UserModel.findOneAndUpdate({ secret }, { $unset: { secret: true }, active: true });
    if (!user) throw ApiError.BadRequest(USER_MESSAGE.INCORRECT_ACTIVATION_LINK);
  }

  static async signIn(dto) {
    const user = await UserModel.findOne({ email: dto.email, active: true });
    if (!user) throw ApiError.NotFound(USER_MESSAGE.NOT_FOUND_EMAIL);

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw ApiError.BadRequest(USER_MESSAGE.WRONG_CREDENTIALS);

    const userData = new UserDto(user).get();

    const tokens = TokenService.generateTokens(userData);
    await TokenService.saveRefreshToken(userData.id, tokens.refreshToken);

    return { ...userData, ...tokens };
  }

  static async logout(refreshToken) {
    return TokenService.removeRefreshToken(refreshToken);
  }

  static async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.Unauthorized();

    const tokenUser = TokenService.validateRefreshToken(refreshToken);
    const dbToken = await TokenService.findRefreshToken(refreshToken);
    if (!tokenUser || !dbToken) throw ApiError.Unauthorized();

    const user = await UserModel.findById(tokenUser.id);
    const userData = new UserDto(user).get();

    const tokens = TokenService.generateTokens(userData);
    await TokenService.saveRefreshToken(userData.id, tokens.refreshToken);

    return { ...userData, ...tokens };
  }
}
