import { Router } from 'express';
import { prey } from '../../utils/index.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { FileController } from './file.controller.js';
import { fileValidations } from './file.validations.js';

export const file = Router();

file.get('/:user_id/:file_name',
  authMiddleware,
  fileValidations.get_file,
  prey(FileController.getFile)
);
