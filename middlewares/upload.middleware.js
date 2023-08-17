import fs from 'fs';
import path from 'path';
import moment from 'moment';
import multer, { MulterError } from 'multer';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const path = `./uploads/${ req.user.id }`;

    try {
      await fs.promises.stat(path);
      cb(null, path);
    } catch (e) {
      await fs.promises.mkdir(path, { recursive: true });
      cb(null, path);
    }
  },

  filename: (req, file, cb) => {
    cb(null, `${ file.fieldname }-${ moment().format('DD:MM:YYYY-hh:mm:ss') }${ path.extname(file.originalname) }`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') return cb(null, true);

  cb(new MulterError('Invalid file type. Only JPEG and PNG files are allowed.'));
}

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
