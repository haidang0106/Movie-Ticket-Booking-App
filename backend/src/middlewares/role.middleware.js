/**
 * Role Middleware — Phân quyền RBAC
 * 
 * STUB: TV5 (Module 8) sẽ triển khai đầy đủ.
 * File này tạo tạm để code không crash khi test.
 * 
 * Sử dụng: roleMiddleware(['ADMIN', 'SUPER_ADMIN'])
 */
const { AppError } = require('../utils');

const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    // Kiểm tra người dùng đã được xác thực chưa (qua authMiddleware)
    if (!req.user) {
      return next(AppError.unauthorized('Chưa xác thực', 'NOT_AUTHENTICATED'));
    }
    
    // Kiểm tra quyền truy cập
    const userRole = req.user.accountType;
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return next(AppError.forbidden(
        `Chỉ ${allowedRoles.join(', ')} mới được truy cập`,
        'INSUFFICIENT_ROLE'
      ));
    }
    
    next();
  };
};

module.exports = { roleMiddleware };
