import { Router } from 'express';
import { tryCatch } from '../api.decorators.js';
import authController from './auth.controller.js';
import authMiddleware from './auth.middleware.js';

const router = Router();

router.post('/auth/sign-up',
  tryCatch(authController.signUp)
);

router.get('/auth/activate/:secret',
  tryCatch(authController.activate)
);

router.post('/auth/sign-in',
  tryCatch(authController.signIn)
);

router.post('/auth/logout',
  authMiddleware,
  tryCatch(authController.logout)
);

router.post('/auth/test',
  authMiddleware,
  (req, res) => {
    res.success(200, { message: 'Hello' })
  }
);

router.get('/auth/refresh',
  tryCatch(authController.refresh)
);

export default router;
