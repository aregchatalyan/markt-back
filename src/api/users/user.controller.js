import { UserService } from './user.service.js';
import { UserDto } from '../../models/user/user.dto.js';

export class UserController {
  static async me(req, res) {
    const { id } = req.user;

    const user = await UserService.me(id);

    res.success(200, user);
  }

  static async getUser(req, res) {
    const { userId } = req.params;

    const user = await UserService.getUser(userId);

    res.success(200, user);
  }

  static async getAllUsers(req, res) {
    const users = await UserService.getAllUsers();

    res.success(200, users);
  }

  static async updateUser(req, res) {
    const { id: userId } = req.user;

    const user = await UserService.updateUser(userId, new UserDto(req.body).update());

    res.success(200, user);
  }

  static async uploadAvatar(req, res) {
    const { id: userId } = req.user;

    const user = await UserService.uploadAvatar(userId, req?.file?.path);

    res.success(200, user);
  }

  static async deleteUser(req, res) {
    const { id: userId } = req.user;
    const { password } = req.body;

    await UserService.deleteUser(userId, password);

    res.success(200);
  }
}
