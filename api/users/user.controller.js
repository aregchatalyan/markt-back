import userService from './user.service.js';
import UserDto from '../../models/user/user.dto.js';

class UserController {
  async getUser(req, res) {
    const { user_id } = req.params;

    const user = await userService.getUser(user_id);

    res.success(200, user);
  }

  async getAllUsers(req, res) {
    const users = await userService.getAllUsers();

    res.success(200, users);
  }

  async updateUser(req, res) {
    const { id: user_id } = req.user;

    if (req?.file?.path) req.body.avatar = req.file.path;

    const user = await userService.updateUser(user_id, new UserDto(req.body).update());

    res.success(200, user);
  }

  async deleteUser(req, res) {
    const { id: user_id } = req.user;
    const { password } = req.body;

    await userService.deleteUser(user_id, password);

    res.success(200);
  }
}

export default new UserController();
