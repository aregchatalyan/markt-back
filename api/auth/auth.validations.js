import { validation } from '../../middlewares/index.js';
import { VALID_USER } from '../../models/user/user.model.js';

const authValidations = {
  sign_up: validation([
    { path: 'first_name', required: true, length: VALID_USER.FIRST_NAME },
    { path: 'last_name', required: true, length: VALID_USER.LAST_NAME },
    { path: 'username', optional: true, length: VALID_USER.USERNAME },
    { path: 'email', required: true, email: true },
    { path: 'phone', optional: true, phone: true },
    { path: 'password', required: true, length: VALID_USER.PASSWORD }
  ]),

  activate: validation([
    { path: 'secret', required: true, where: 'param' }
  ]),

  sign_in: validation([
    { path: 'email', required: true, email: true },
    { path: 'password', required: true, length: VALID_USER.PASSWORD }
  ])
}

export default authValidations;
