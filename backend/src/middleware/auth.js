// middleware/auth.js

import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        throw new ApiError(401, 'Authentication required');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        throw new ApiError(403, 'Access denied');
      }

      next();
    } catch (error) {
      next(new ApiError(401, 'Invalid token'));
    }
  };
};
