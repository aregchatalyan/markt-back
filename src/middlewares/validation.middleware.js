import fs from 'fs';
import validation from 'express-validator';
import { messages } from '../utils/index.js';

export const validationMiddleware = (checks) => async (req, res, next) => {
  let chain;
  let income;

  for (const { path, where = 'body', ...check } of checks) {
    chain = validation[where](path);
    income = req[{ body: 'body', query: 'query', param: 'params', header: 'headers', cookie: 'cookies' }[where]][path];

    if (check.required) chain.trim().not().isEmpty()
      .withMessage(messages('required', path));

    if (check.optional) chain.trim().optional({ checkFalsy: true });

    if (check.mongo) chain.trim().isMongoId()
      .withMessage(messages('mongo', path));

    if (check.length?.min) chain.trim().isLength({ min: check.length.min })
      .withMessage(messages('length.min', path, income, check.length.min));

    if (check.length?.max) chain.trim().isLength({ max: check.length.max })
      .withMessage(messages('length.max', path, income, check.length.max));

    if (check.email) chain.trim().toLowerCase().isEmail({ host_whitelist: [ 'gmail.com' ] })
      .withMessage(messages('email', path, income));

    if (check.phone) chain.trim().isMobilePhone('any', { strictMode: true })
      .withMessage(messages('phone', path, income));

    await chain.run(req);
  }

  const result = validation.validationResult(req);

  if (!result.isEmpty()) {
    if (req?.file?.path) await fs.promises.unlink(req.file.path);
    return res.error(400, 'Validation failed.', result.array());
  }

  next();
}
