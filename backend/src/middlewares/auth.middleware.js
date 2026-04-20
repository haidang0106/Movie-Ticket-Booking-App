/**
 * Auth Middleware — Xác thực JWT token
 * 
 * STUB: TV5 (Module 8) sẽ triển khai đầy đủ.
 * File này tạo tạm để code không crash khi test.
 */
const { AppError } = require('../utils');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Token không được cung cấp', 'MISSING_TOKEN');
    }
    
    const token = authHeader.split(' ')[1];
    
    // TODO: TV5 sẽ triển khai JWT verify đầy đủ
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // STUB: Mock user cho giai đoạn phát triển/kiểm thử
    req.user = {
      accountId: 1,
      customerId: 1,
      accountType: 'ADMIN',
      email: 'admin@test.com'
    };
    
    next();
  } catch (error) {
    if (error.statusCode) {
      return next(error);
    }
    next(AppError.unauthorized('Token không hợp lệ', 'INVALID_TOKEN'));
  }
};

module.exports = { authMiddleware };
