import jwt from 'jsonwebtoken';
import config from '../../config.js';

const authMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const token = req.headers.authorization.split('')[1];

    const user = jwt.verify(token, config.JWT_ACCESS_SECRET);
    if (!user) next('Unauthorized');

    // TODO Implement other cases;

    next();
  } catch (e) {
    next('Unauthorized');
  }
}

export default authMiddleware;
