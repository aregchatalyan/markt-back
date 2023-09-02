import { auth } from './auth/auth.routes.js';
import { user } from './users/user.routes.js';
import { file } from './files/file.routes.js';
import { sendMiddleware, errorMiddleware } from '../middlewares/index.js';

export const routes = (app) => {
  app.use(sendMiddleware);

  app.use('/api/auth', auth);
  app.use('/api/user', user);
  app.use('/uploads', file);

  app.use(errorMiddleware);
}
