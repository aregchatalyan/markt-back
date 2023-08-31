import fs from 'fs';
import ApiError from '../api.error.js';
import apiMessages from '../api.messages.js';
import UserDto from '../../models/user/user.dto.js';
import UserModel from '../../models/user/user.model.js';
import bcrypt from 'bcrypt';

const { USER_MESSAGE } = apiMessages;

class UserService {
  async getUser(id) {
    const user = await UserModel.findOne({ _id: id, active: true });
    if (!user) throw ApiError.NotFound(USER_MESSAGE.NOT_FOUND_ID);

    return new UserDto(user).get();
  }

  async getAllUsers() {
    const users = await UserModel.find({ active: true });

    return users.map(user => new UserDto(user).get());
  }

  async updateUser(id, dto) {
    const candidate = await UserModel.findOneAndUpdate({ _id: id, active: true }, { ...dto });
    if (!candidate) throw ApiError.NotFound(USER_MESSAGE.NOT_FOUND);

    if (candidate.avatar) {
      try {
        await fs.promises.stat(candidate.avatar);
        await fs.promises.unlink(candidate.avatar);
      } catch (e) {
        console.error('The file was deleted under strange circumstances. 🤠');
      }
    }

    const user = await UserModel.findById(id);

    return new UserDto(user).get();
  }

  async deleteUser(id, password) {
    const candidate = await UserModel.findOne({ _id: id, active: true });
    if (!candidate) throw ApiError.NotFound(USER_MESSAGE.NOT_FOUND);

    const isValid = await bcrypt.compare(password, candidate.password);
    if (!isValid) throw ApiError.BadRequest(USER_MESSAGE.WRONG_CREDENTIALS);

    await candidate.deleteOne();

    if (candidate.avatar) {
      try {
        await fs.promises.stat(candidate.avatar);
        await fs.promises.unlink(candidate.avatar);
      } catch (e) {
        console.error('The file was deleted under strange circumstances. 🤠');
      }
    }
  }
}

export default new UserService();
