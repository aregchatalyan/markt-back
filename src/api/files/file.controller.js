import path from 'path';
import { dirname } from '../../utils/index.js';
import { FileService } from './file.service.js';

export class FileController {
  static async getFile(req, res) {
    const { userId, filename } = req.params;

    const file = await FileService.getFile(userId, filename);

    const root = path.join(dirname(import.meta.url), '../../../');

    res.sendFile(`${ root }/${ file }`);
  }
}
