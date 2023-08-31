import { Router } from 'express';
import { prey } from '../../utils/index.js';
import authMiddleware from '../auth/auth.middleware.js';
import authController from './user.controller.js';
import authValidations from './user.validations.js';
import { upload } from '../../middlewares/index.js';

const router = Router();

router.get('/:user_id',
  authMiddleware,
  authValidations.get_user,
  prey(authController.getUser)
);

router.get('/',
  authMiddleware,
  prey(authController.getAllUsers)
);

router.put('/',
  authMiddleware,
  upload.single('avatar'),
  authValidations.update_user,
  prey(authController.updateUser)
);

router.delete('/',
  authMiddleware,
  authValidations.delete_user,
  prey(authController.deleteUser)
);

export default router;


