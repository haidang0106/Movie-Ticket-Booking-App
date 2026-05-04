import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { AppException } from '../utils/exceptions/app.exception';
import { ErrorCode } from '../utils/exceptions/error.code';

/**
 * Middleware phân quyền (Role-Based Access Control)
 * Bắt buộc phải đặt sau authMiddleware.
 * @param allowedRoles Danh sách các AccountType được phép truy cập
 */
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Nếu chưa có req.user (tức là quên đặt sau authMiddleware hoặc lỗi), chặn ngay
    if (!req.user) {
      return next(new AppException(ErrorCode.UNAUTHENTICATED));
    }

    // Kiểm tra xem AccountType của user có nằm trong danh sách cho phép không
    if (!allowedRoles.includes(req.user.accountType)) {
      return next(new AppException(ErrorCode.FORBIDDEN));
    }

    // Hợp lệ, cho qua luồng route tiếp theo
    next();
  };
};
