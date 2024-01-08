import { Router } from 'express';
import { prey } from '../../utils/index.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { UserController } from './user.controller.js';
import { userValidations } from './user.validations.js';
import { uploadMiddleware } from '../../middlewares/index.js';
import { VALID_USER } from '../../models/user/user.model.js';

export const user = Router();

const { ROLES } = VALID_USER;

user.get('/me',
  authMiddleware(ROLES.USER),
  prey(UserController.me)
);

user.get('/:userId',
  authMiddleware(ROLES.USER),
  userValidations.getUser,
  prey(UserController.getUser)
);

user.get('/',
  authMiddleware(ROLES.USER),
  prey(UserController.getAllUsers)
);

user.put('/',
  authMiddleware(ROLES.USER),
  userValidations.updateUser,
  prey(UserController.updateUser)
);

user.patch('/',
  authMiddleware(ROLES.USER),
  uploadMiddleware.single('avatar'),
  prey(UserController.uploadAvatar)
);

user.delete('/',
  authMiddleware(ROLES.USER),
  userValidations.deleteUser,
  prey(UserController.deleteUser)
);
