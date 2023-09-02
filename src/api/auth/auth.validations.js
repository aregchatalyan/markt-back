import { VALID_USER } from '../../models/user/user.model.js';
import { validationMiddleware } from '../../middlewares/index.js';

export const authValidations = {
  sign_up: validationMiddleware([
    { path: 'first_name', required: true, length: VALID_USER.FIRST_NAME },
    { path: 'last_name', required: true, length: VALID_USER.LAST_NAME },
    { path: 'username', optional: true, length: VALID_USER.USERNAME },
    { path: 'email', required: true, email: true },
    { path: 'phone', optional: true, phone: true },
    { path: 'password', required: true, length: VALID_USER.PASSWORD }
  ]),

  activate: validationMiddleware([
    { path: 'secret', required: true, where: 'param' }
  ]),

  sign_in: validationMiddleware([
    { path: 'email', required: true, email: true },
    { path: 'password', required: true, length: VALID_USER.PASSWORD }
  ])
}
