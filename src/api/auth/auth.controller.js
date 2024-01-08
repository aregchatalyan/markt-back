import { config } from '../../config.js';
import { AuthService } from './auth.service.js';
import { UserDto } from '../../models/user/user.dto.js';

export class AuthController {
  static async signUp(req, res) {
    const user = await AuthService.signUp(new UserDto(req.body).create());

    res.success(201, user);
  }

  static async activate(req, res) {
    const { secret } = req.params;

    await AuthService.activate(secret);

    res.redirect(`${ config.CLIENT_URL }/auth/sign-in`);
  }

  static async signIn(req, res) {
    const user = await AuthService.signIn(req.body);

    res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.success(200, user);
  }

  static async logout(req, res) {
    const { refreshToken } = req.cookies;
    console.log(refreshToken)

    await AuthService.logout(refreshToken);

    res.clearCookie('refreshToken');
    // res.redirect(`${ config.CLIENT_URL }/auth/sign-in`);
    res.end();
  }

  static async refresh(req, res) {
    const { refreshToken } = req.cookies;

    const user = await AuthService.refresh(refreshToken);

    res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.success(200, user);
  }
}
