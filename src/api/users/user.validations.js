import { validationMiddleware } from '../../middlewares/index.js';
import { VALID_USER } from '../../models/user/user.model.js';

export const userValidations = {
  get_user: validationMiddleware([
    { path: 'user_id', required: true, mongo: true, where: 'param' }
  ]),

  update_user: validationMiddleware([
    { path: 'first_name', required: true, length: VALID_USER.FIRST_NAME },
    { path: 'last_name', required: true, length: VALID_USER.LAST_NAME },
    { path: 'username', required: true, length: VALID_USER.USERNAME },
    { path: 'email', optional: true, email: true },
    { path: 'phone', optional: true, phone: true },
    { path: 'password', optional: true, length: VALID_USER.PASSWORD }
  ]),

  delete_user: validationMiddleware([
    { path: 'password', required: true, length: VALID_USER.PASSWORD }
  ])
}
