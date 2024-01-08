import { ApiError } from '../api.error.js';
import { UserDto } from '../../models/user/user.dto.js';
import { UserModel, VALID_USER } from '../../models/user/user.model.js';
import { TokenService } from '../../services/token.service.js';

const { ROLES } = VALID_USER;

export const authMiddleware = (role) => {
  return async (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      if (!accessToken) return next(ApiError.Unauthorized());

      const user = TokenService.validateAccessToken(accessToken);
      if (!user) return next(ApiError.Unauthorized());

      const dbUser = await UserModel.findById(user.id);
      if (!dbUser) return next(ApiError.Unauthorized());

      if (role !== ROLES.ADMIN)
        if ((user.role !== role) || (dbUser.role !== role)) return next(ApiError.Forbidden());

      req.user = new UserDto(dbUser).get();

      next();
    } catch (e) {
      return next(ApiError.Unauthorized());
    }
  }
}
