import { UserService } from './user.service.js';
import { UserDto } from '../../models/user/user.dto.js';

export class UserController {
  static async getUser(req, res) {
    const { user_id } = req.params;

    const user = await UserService.getUser(user_id);

    res.success(200, user);
  }

  static async getAllUsers(req, res) {
    const users = await UserService.getAllUsers();

    res.success(200, users);
  }

  static async updateUser(req, res) {
    const { id: user_id } = req.user;

    const user = await UserService.updateUser(user_id, new UserDto(req.body).update());

    res.success(200, user);
  }

  static async uploadAvatar(req, res) {
    const { id: user_id } = req.user;

    const user = await UserService.uploadAvatar(user_id, req?.file?.path);

    res.success(200, user);
  }

  static async deleteUser(req, res) {
    const { id: user_id } = req.user;
    const { password } = req.body;

    await UserService.deleteUser(user_id, password);

    res.success(200);
  }
}
