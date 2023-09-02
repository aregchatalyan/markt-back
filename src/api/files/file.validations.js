import { validationMiddleware } from '../../middlewares/index.js';

export const fileValidations = {
  get_file: validationMiddleware([
    { path: 'user_id', required: true, mongo: true, where: 'param' },
    { path: 'file_name', required: true, where: 'param' }
  ])
}
