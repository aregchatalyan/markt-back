import authService from './user.service.js';
import UserDto from '../../models/user/user.dto.js';

class UserController {
  async getUser(req, res) {
    const { user_id } = req.params;

    const user = await authService.getUser(user_id);

    res.success(200, user);
  }

  async getAllUsers(req, res) {
    const users = await authService.getAllUsers();

    res.success(200, users);
  }

  async updateUser(req, res) {
    const { user_id } = req.params;

    if (req?.file?.path) req.body.avatar = req.file.path;

    const user = await authService.updateUser(user_id, new UserDto(req.body).update());

    res.success(200, user);
  }
}

export default new UserController();
