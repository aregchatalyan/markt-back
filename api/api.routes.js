import auth from './auth/auth.routes.js';
import user from './users/user.routes.js';
import file from './files/file.routes.js';
import { send, error } from '../middlewares/index.js';

const routes = (app) => {
  app.use(send);

  app.use('/api/auth', auth);
  app.use('/api/user', user);
  app.use('/uploads', file);

  app.use(error);
}

export default routes;
