import ApiError from './api.error.js';

export const errorHandler = (err, req, res, _) => {
  if (err && err instanceof ApiError) {
    return res.error(err.status, err.message, err.errors);
  }

  return console.error(err.message);
}

export const send = (req, res, next) => {
  const codes = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error'
  }

  res.success = (status, data = null, message = '') => {
    return res.status(status).json({
      status: codes[status] || 'Unknown Status',
      message: message,
      data: data
    });
  }

  res.error = (status, message = '', errors = []) => {
    return res.status(status).json({
      status: codes[status] || 'Unknown Status',
      message: message,
      errors: errors
    });
  }

  next();
}
