import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = (path) => { // path is import.meta.url
  return dirname(fileURLToPath(path));
}

export default __dirname;