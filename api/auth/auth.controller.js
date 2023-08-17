import config from '../../config.js';
import authService from './auth.service.js';
import UserDto from '../../models/user/user.dto.js';

class AuthController {
  async signUp(req, res) {
    const user = await authService.signUp(new UserDto(req.body).create());

    res.success(201, user);
  }

  async activate(req, res) {
    const { secret } = req.params;

    await authService.activate(secret);

    res.redirect(`${ config.CLIENT_URL }/auth/sign-in`);
  }

  async signIn(req, res) {
    const user = await authService.signIn(req.body);

    res.cookie('refresh_token', user.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.success(200, user);
  }

  async logout(req, res) {
    const { refresh_token } = req.cookies;

    await authService.logout(refresh_token);

    res.clearCookie('refresh_token');
    res.redirect(`${ config.CLIENT_URL }/auth/sign-in`);
  }

  async refresh(req, res) {
    const { refresh_token } = req.cookies;

    const user = await authService.refresh(refresh_token);

    res.cookie('refresh_token', user.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.success(200, user);
  }
}

export default new AuthController();
