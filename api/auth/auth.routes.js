import { Router } from 'express';
import authController from './auth.controller.js';
import authMiddleware from './auth.middleware.js';
import tryCatchDecorator from '../try-catch.decorator.js';
import authValidations from './auth.validations.js';
import validationMiddleware from '../../middlewares/validation.middleware.js';

const router = Router();

router.post('/sign-up',
  validationMiddleware(authValidations.sign_up),
  tryCatchDecorator(authController.signUp)
);

router.get('/activate/:secret',
  validationMiddleware(authValidations.activate),
  tryCatchDecorator(authController.activate)
);

router.post('/sign-in',
  validationMiddleware(authValidations.sign_in),
  tryCatchDecorator(authController.signIn)
);

router.post('/logout',
  authMiddleware,
  tryCatchDecorator(authController.logout)
);

router.get('/refresh',
  tryCatchDecorator(authController.refresh)
);

export default router;
