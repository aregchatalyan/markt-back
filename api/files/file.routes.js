import { Router } from 'express';
import { prey } from '../../utils/index.js';
import authMiddleware from '../auth/auth.middleware.js';
import fileController from './file.controller.js';
import fileValidations from './file.validations.js';

const router = Router();

router.get('/:user_id/:file_name',
  authMiddleware,
  fileValidations.get_file,
  prey(fileController.getFile)
);

export default router;


