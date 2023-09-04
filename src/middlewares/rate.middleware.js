import { rateLimit } from 'express-rate-limit';

export const rateMiddleware = rateLimit({
  max: 100,
  windowMs: 60 * 1000,
  handler: (req, res, next, opts) => {
    res.error(opts.statusCode, opts.message);
  }
});
