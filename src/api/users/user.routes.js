import { Router } from 'express';
import { prey } from '../../utils/index.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { UserController } from './user.controller.js';
import { userValidations } from './user.validations.js';
import { uploadMiddleware } from '../../middlewares/index.js';

export const user = Router();

user.get('/:user_id',
  authMiddleware,
  userValidations.get_user,
  prey(UserController.getUser)
);

user.get('/',
  authMiddleware,
  prey(UserController.getAllUsers)
);

user.put('/',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  userValidations.update_user,
  prey(UserController.updateUser)
);

user.delete('/',
  authMiddleware,
  userValidations.delete_user,
  prey(UserController.deleteUser)
);

