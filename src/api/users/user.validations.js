import { validationMiddleware } from '../../middlewares/index.js';
import { VALID_USER } from '../../models/user/user.model.js';

export const userValidations = {
  getUser: validationMiddleware([
    { path: 'userId', required: true, mongo: true, where: 'param' }
  ]),

  updateUser: validationMiddleware([
    { path: 'firstName', required: true, length: VALID_USER.FIRST_NAME },
    { path: 'lastName', required: true, length: VALID_USER.LAST_NAME },
    { path: 'username', required: true, length: VALID_USER.USERNAME },
    { path: 'email', optional: true, email: true },
    { path: 'phone', optional: true, phone: true },
    { path: 'password', optional: true, length: VALID_USER.PASSWORD }
  ]),

  deleteUser: validationMiddleware([
    { path: 'password', required: true, length: VALID_USER.PASSWORD }
  ])
}
