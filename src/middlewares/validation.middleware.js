import fs from 'fs';
import validation from 'express-validator';

const messages = (type, path, income, should) => {
  const [ outer, inner ] = type.split('.');

  const m = {
    required: `Path ${ path } required.`,
    mongo: `Path ${ path } invalid.`,
    length: {
      min: `Path ${ path } (${ income }) is shorter than the minimum allowed length (${ should }).`,
      max: `Path ${ path } (${ income }) is longer than the maximum allowed length (${ should }).`
    },
    email: `Path ${ path } (${ income }) is invalid email address or the host is not supported.`,
    phone: `Path ${ path } (${ income }) is invalid phone number or the operator is not supported.`
  }

  return !inner ? m[outer] : m[outer][inner];
}

const diff = {
  body: 'body',
  cookies: 'cookie',
  headers: 'header',
  query: 'query',
  param: 'params'
}

export const validationMiddleware = (checks) => async (req, res, next) => {
  let chain;

  for (const { path, where = 'body', ...check } of checks) {
    chain = validation[where](path);

    if (check.required) chain.trim().not().isEmpty().withMessage(messages('required', path));

    if (check.optional) chain.trim().optional({ checkFalsy: true });

    if (check.mongo) chain.trim().isMongoId().withMessage(messages('mongo', path));

    if (check.length?.min) chain.trim().isLength({ min: check.length.min }).withMessage(messages('length.min', path, req[diff[where]][path], check.length.min));

    if (check.length?.max) chain.trim().isLength({ max: check.length.max }).withMessage(messages('length.max', path, req[diff[where]][path], check.length.max));

    if (check.email) chain.trim().isEmail({ host_whitelist: [ 'gmail.com' ] }).withMessage(messages('email', path, req[diff[where]][path]));

    if (check.phone) chain.trim().isMobilePhone('any', { strictMode: true }).withMessage(messages('phone', path, req[diff[where]][path]));

    await chain.run(req);
  }

  const result = validation.validationResult(req);

  if (!result.isEmpty()) {
    if (req?.file?.path) await fs.promises.unlink(req.file.path);
    return res.error(400, 'Validation failed.', result.array());
  }

  next();
}
