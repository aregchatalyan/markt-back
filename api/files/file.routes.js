import { Router } from 'express';
import fileController from './file.controller.js';
import authMiddleware from '../auth/auth.middleware.js';
import tryCatchDecorator from '../try-catch.decorator.js';

const router = Router();

router.get('/:user_id/:file_name',
  authMiddleware,
  tryCatchDecorator(fileController.getFile)
);

export default router;


