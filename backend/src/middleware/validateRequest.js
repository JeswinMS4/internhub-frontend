import { ApiError } from '../utils/ApiError.js';

// middleware/validateRequest.js

export const validateRequest = (schema) => (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(new ApiError(400, error.errors.map(e => e.message).join(', ')));
    }
  };
  