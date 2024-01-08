import { validationMiddleware } from '../../middlewares/index.js';

export const fileValidations = {
  getFile: validationMiddleware([
    { path: 'userId', required: true, mongo: true, where: 'param' },
    { path: 'fileName', required: true, where: 'param' }
  ])
}
