import { Router } from 'express';
import { prey } from '../../utils/index.js';
import { authMiddleware } from './auth.middleware.js';
import { AuthController } from './auth.controller.js';
import { authValidations } from './auth.validations.js';
import { VALID_USER } from '../../models/user/user.model.js';

export const auth = Router();

const { ROLES } = VALID_USER;

auth.post('/sign-up',
  authValidations.signUp,
  prey(AuthController.signUp)
);

auth.get('/activate/:secret',
  authValidations.activate,
  prey(AuthController.activate)
);

auth.post('/sign-in',
  authValidations.signIn,
  prey(AuthController.signIn)
);

auth.post('/logout',
  authMiddleware(ROLES.USER),
  prey(AuthController.logout)
);

auth.get('/refresh',
  prey(AuthController.refresh)
);
