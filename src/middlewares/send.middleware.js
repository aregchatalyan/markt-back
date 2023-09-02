export const sendMiddleware = (req, res, next) => {
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
