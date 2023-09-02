import { MulterError } from 'multer';
import { ApiError } from '../api/api.error.js';

export const errorMiddleware = (err, req, res, _) => {
  if (err && err instanceof ApiError) {
    return res.error(err.status, err.message, err.errors);
  }

  if (err instanceof MulterError) {
    return res.error(400, err.code);
  }

  console.log(err.message);
  res.error(500, 'Oops, sorry we will fix it soon.');
}
