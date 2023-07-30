import { Router } from 'express';
import authController from './auth.controller.js';

const router = Router();

router.post('/auth/sign-up',
  authController.signUp
);

router.post('/auth/sign-in',
  authController.signIn
);

router.post('/auth/logout',
  authController.logout
);

router.post('/auth/refresh',
  authController.refresh
);

export default router;
