import { validation } from '../../middlewares/index.js';

const userValidations = {
  get_file: validation([
    { path: 'user_id', required: true, mongo: true, where: 'param' },
    { path: 'file_name', required: true, where: 'param' }
  ])
}

export default userValidations;
