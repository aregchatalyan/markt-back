import { Router } from 'express';
import { prey } from '../../utils/index.js';
import authMiddleware from './auth.middleware.js';
import authController from './auth.controller.js';
import authValidations from './auth.validations.js';

const router = Router();

router.post('/sign-up',
  authValidations.sign_up,
  prey(authController.signUp)
);

router.get('/activate/:secret',
  authValidations.activate,
  prey(authController.activate)
);

router.post('/sign-in',
  authValidations.sign_in,
  prey(authController.signIn)
);

router.post('/logout',
  authMiddleware,
  prey(authController.logout)
);

router.get('/refresh',
  prey(authController.refresh)
);

export default router;
