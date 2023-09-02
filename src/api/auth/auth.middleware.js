import { ApiError } from '../api.error.js';
import { UserDto } from '../../models/user/user.dto.js';
import { UserModel } from '../../models/user/user.model.js';
import { TokenService } from '../../services/token.service.js';

export const authMiddleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const access_token = req.headers.authorization.split(' ')[1];
    if (!access_token) return next(ApiError.Unauthorized());

    const user = TokenService.validateAccessToken(access_token);
    if (!user) return next(ApiError.Unauthorized());

    const db_user = await UserModel.findById(user.id);
    if (!db_user) return next(ApiError.Unauthorized());

    req.user = new UserDto(db_user).get();

    next();
  } catch (e) {
    return next(ApiError.Unauthorized());
  }
}
