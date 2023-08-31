import path from 'path';
import fileService from './file.service.js';
import { dirname } from '../../utils/index.js';

class FileController {
  async getFile(req, res) {
    const { user_id, file_name } = req.params;

    const file = await fileService.getFile(user_id, file_name);

    const root = path.join(dirname(import.meta.url), '../../');

    res.sendFile(`${ root }/${ file }`);
  }
}

export default new FileController();
