import fs from 'fs';
import { ApiError } from '../api.error.js';
import { apiMessages } from '../api.messages.js';
import { UserModel } from '../../models/user/user.model.js';

const { FILE_MESSAGE } = apiMessages;

export class FileService {
  static async getFile(userId, filename) {
    const user = await UserModel.findOne({
      _id: userId,
      active: true,
      avatar: { $regex: filename, $options: 'i' }
    });
    if (!user) throw ApiError.NotFound(FILE_MESSAGE.NOT_FOUND_ID);

    try {
      await fs.promises.stat(user.avatar);
    } catch (e) {
      throw ApiError.NotFound(FILE_MESSAGE.NOT_FOUND_ID);
    }

    return user.avatar;
  }
}
