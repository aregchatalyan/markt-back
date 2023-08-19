import { Router } from 'express';
import userController from './user.controller.js';
import authMiddleware from '../auth/auth.middleware.js';
import tryCatchDecorator from '../try-catch.decorator.js';
import uploadMiddleware from '../../middlewares/upload.middleware.js';
import userValidations from './user.validations.js';
import validationMiddleware from '../../middlewares/validation.middleware.js';

const router = Router();

router.get('/:user_id',
  authMiddleware,
  validationMiddleware(userValidations.get_user),
  tryCatchDecorator(userController.getUser)
);

router.get('/',
  authMiddleware,
  tryCatchDecorator(userController.getAllUsers)
);

router.put('/:user_id',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  validationMiddleware(userValidations.update_user, true),
  tryCatchDecorator(userController.updateUser)
);

export default router;


