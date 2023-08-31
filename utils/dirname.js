import url from 'url';
import path from 'path';

const dirname = (pathname) => { // path is import.meta.url
  return path.dirname(url.fileURLToPath(pathname));
}

export default dirname;
