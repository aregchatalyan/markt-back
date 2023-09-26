import { ApiError } from '../api.error.js';
import { UserDto } from '../../models/user/user.dto.js';
import { UserModel, VALID_USER } from '../../models/user/user.model.js';
import { TokenService } from '../../services/token.service.js';

const { ROLES } = VALID_USER;

export const authMiddleware = (role) => {
  return async (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    try {
      const access_token = req.headers.authorization.split(' ')[1];
      if (!access_token) return next(ApiError.Unauthorized());

      const user = TokenService.validateAccessToken(access_token);
      if (!user) return next(ApiError.Unauthorized());

      const db_user = await UserModel.findById(user.id);
      if (!db_user) return next(ApiError.Unauthorized());

      if (role !== ROLES.ADMIN)
        if ((user.role !== role) || (db_user.role !== role)) return next(ApiError.Forbidden());

      req.user = new UserDto(db_user).get();

      next();
    } catch (e) {
      return next(ApiError.Unauthorized());
    }
  }
}
