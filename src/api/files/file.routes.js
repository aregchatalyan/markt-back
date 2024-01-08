import { Router } from 'express';
import { prey } from '../../utils/index.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { FileController } from './file.controller.js';
import { fileValidations } from './file.validations.js';
import { VALID_USER } from '../../models/user/user.model.js';

export const file = Router();

const { ROLES } = VALID_USER;

file.get('/:userId/:filename',
  authMiddleware(ROLES.USER),
  fileValidations.getFile,
  prey(FileController.getFile)
);
