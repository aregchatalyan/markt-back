import url from 'url';
import path from 'path';

export const prey = (handler) => (req, res, next) => {
  handler(req, res, next).catch(next);
}

export const dirname = (pathname) => { // path is import.meta.url
  return path.dirname(url.fileURLToPath(pathname));
}
