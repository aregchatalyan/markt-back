import { Router } from 'express';
import { prey } from '../../utils/index.js';
import { authMiddleware } from './auth.middleware.js';
import { AuthController } from './auth.controller.js';
import { authValidations } from './auth.validations.js';

export const auth = Router();

auth.post('/sign-up',
  authValidations.sign_up,
  prey(AuthController.signUp)
);

auth.get('/activate/:secret',
  authValidations.activate,
  prey(AuthController.activate)
);

auth.post('/sign-in',
  authValidations.sign_in,
  prey(AuthController.signIn)
);

auth.post('/logout',
  authMiddleware,
  prey(AuthController.logout)
);

auth.get('/refresh',
  prey(AuthController.refresh)
);
