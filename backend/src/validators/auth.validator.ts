import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppException } from '../utils/exceptions/app.exception';
import { ErrorCode } from '../utils/exceptions/error.code';

export const authValidator = {
  validateRegister: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(new AppException({ ...ErrorCode.INVALID_DATA, message: error.details[0].message }));
    }
    next();
  },

  validateLogin: (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(new AppException({ ...ErrorCode.INVALID_DATA, message: error.details[0].message }));
    }
    next();
  }
};
