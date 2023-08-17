import { Router } from 'express';
import authController from './auth.controller.js';
import authMiddleware from './auth.middleware.js';
import tryCatchDecorator from '../try-catch.decorator.js';

const router = Router();

router.post('/auth/sign-up',
  tryCatchDecorator(authController.signUp)
);

router.get('/auth/activate/:secret',
  tryCatchDecorator(authController.activate)
);

router.post('/auth/sign-in',
  tryCatchDecorator(authController.signIn)
);

router.post('/auth/logout',
  tryCatchDecorator(authController.logout)
);

router.post('/auth/test',
  authMiddleware,
  (req, res) => {
    res.success(200, { message: 'Hello' })
  }
);

router.get('/auth/refresh',
  tryCatchDecorator(authController.refresh)
);

export default router;
