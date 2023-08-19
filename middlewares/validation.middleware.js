import fs from 'fs';
import validation from 'express-validator';

const validationMiddleware = (checks, file) => async (req, res, next) => {
  let chain;

  const diff = {
    body: 'body',
    cookies: 'cookie',
    headers: 'header',
    query: 'query',
    param: 'params'
  }

  for (const { path, where = 'body', ...check } of checks) {
    chain = validation[where](path);

    if (check.required) chain.trim().not().isEmpty().withMessage(`Path ${ path } required.`);
    if (check.optional) chain.trim().optional({ checkFalsy: true });

    if (check.length?.min) chain.trim().isLength({ min: check.length.min })
      .withMessage(`Path ${ path } (${ req[diff[where]][path] }) is shorter than the minimum allowed length (${ check.length.min }).`);
    if (check.length?.max) chain.trim().isLength({ max: check.length.max })
      .withMessage(`Path ${ path } (${ req[diff[where]][path] }) is longer than the maximum allowed length (${ check.length.max }).`);

    if (check.email) chain.trim().isEmail({ host_whitelist: [ 'gmail.com' ] })
      .withMessage(`Path ${ path } (${ req[diff[where]][path] }) is invalid email address or the host is not supported.`);

    if (check.phone) chain.trim().isMobilePhone('any', { strictMode: true })
      .withMessage(`Path ${ path } (${ req[diff[where]][path] }) is invalid phone number or the operator is not supported.`);

    await chain.run(req);
  }

  const result = validation.validationResult(req);
  if (!result.isEmpty()) {
    if (req?.file?.path) await fs.promises.unlink(req.file.path); // TODO move
    return res.error(400, 'Validation failed.', result.array());
  }

  next();
}

export default validationMiddleware;
