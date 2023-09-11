import url from 'url';
import path from 'path';
import crypto from 'crypto';

export const randomBytes = (evenNum) => {
  return crypto.randomBytes(evenNum / 2).toString('hex');
}

export const prey = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    next(e);
  }
}

export const dirname = (pathname) => { // path is import.meta.url
  return path.dirname(url.fileURLToPath(pathname));
}

export const messages = (type, path, income, should) => {
  const [ outer, inner ] = type.split('.');

  const m = {
    required: `Path ${ path } required.`,
    mongo:    `Path ${ path } invalid.`,
    length:   {
      min: `Path ${ path } (${ income }) is shorter than the minimum allowed length (${ should }).`,
      max: `Path ${ path } (${ income }) is longer than the maximum allowed length (${ should }).`
    },
    email:    `Path ${ path } (${ income }) is invalid email address or the host is not supported.`,
    phone:    `Path ${ path } (${ income }) is invalid phone number or the operator is not supported.`
  }

  return !inner ? m[outer] : m[outer][inner];
}
