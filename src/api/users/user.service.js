import fs from 'fs';
import bcrypt from 'bcrypt';
import { ApiError } from '../api.error.js';
import { apiMessages } from '../api.messages.js';
import { UserDto } from '../../models/user/user.dto.js';
import { UserModel } from '../../models/user/user.model.js';

const { USER_MESSAGE, FILE_MESSAGE } = apiMessages;

export class UserService {
  static async getUser(id) {
    const user = await UserModel.findOne({ _id: id, active: true });
    if (!user) throw ApiError.NotFound(USER_MESSAGE.NOT_FOUND_ID);

    return new UserDto(user).get();
  }

  static async getAllUsers() {
    const users = await UserModel.find({ active: true });

    return users.map(user => new UserDto(user).get());
  }

  static async updateUser(id, dto) {
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      dto.password = await bcrypt.hash(dto.password, salt);
    }
    const candidate = await UserModel.findOneAndUpdate({ _id: id, active: true }, { ...dto });
    if (!candidate) throw ApiError.NotFound(USER_MESSAGE.NOT_FOUND);

    const user = await UserModel.findById(id);

    return new UserDto(user).get();
  }

  static async uploadAvatar(id, avatar) {
    if (!avatar) throw ApiError.BadRequest(FILE_MESSAGE.NOT_SELECTED);

    const candidate = await UserModel.findOneAndUpdate({ _id: id, active: true }, { avatar });
    if (!candidate) throw ApiError.NotFound(USER_MESSAGE.NOT_FOUND);

    if (candidate.avatar) {
      try {
        await fs.promises.unlink(candidate.avatar);
      } catch (e) {
        console.error('The file was deleted under strange circumstances. 🤠');
      }
    }

    const user = await UserModel.findById(id);

    return new UserDto(user).get();
  }

  static async deleteUser(id, password) {
    const candidate = await UserModel.findOne({ _id: id, active: true });
    if (!candidate) throw ApiError.NotFound(USER_MESSAGE.NOT_FOUND);

    const isValid = await bcrypt.compare(password, candidate.password);
    if (!isValid) throw ApiError.BadRequest(USER_MESSAGE.WRONG_CREDENTIALS);

    await candidate.deleteOne();

    if (candidate.avatar) {
      try {
        await fs.promises.unlink(candidate.avatar);
      } catch (e) {
        console.error('The file was deleted under strange circumstances. 🤠');
      }
    }
  }
}
