import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppException } from '../utils/exceptions/app.exception';
import { ErrorCode } from '../utils/exceptions/error.code';

export interface JwtPayload {
  accountId: number;
  accountType: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      return next(new Error('JWT_SECRET is not configured'));
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    req.user = {
      accountId: decoded.accountId,
      accountType: decoded.accountType
    };
    
    next();
  } catch (error) {
    if (error instanceof AppException) {
      next(error);
    } else {
      next(new AppException(ErrorCode.UNAUTHENTICATED));
    }
  }
};
