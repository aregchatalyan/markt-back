import auth from './auth/auth.routes.js';
import user from './users/user.routes.js';
import file from './files/file.routes.js';
import sendMiddleware from '../middlewares/send.middleware.js';
import errorMiddleware from '../middlewares/error.middleware.js';

const app = global.app;

app.use(sendMiddleware);

app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/uploads', file);

app.use(errorMiddleware);
