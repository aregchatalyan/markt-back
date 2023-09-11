import fs from 'fs';
import { ApiError } from '../api.error.js';
import { apiMessages } from '../api.messages.js';
import { UserModel } from '../../models/user/user.model.js';

const { FILE_MESSAGE } = apiMessages;

export class FileService {
  static async getFile(user_id, file_name) {
    const user = await UserModel.findOne({
      _id:    user_id,
      active: true,
      avatar: { $regex: file_name, $options: 'i' }
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
