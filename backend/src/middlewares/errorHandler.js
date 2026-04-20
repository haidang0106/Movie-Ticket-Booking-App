/**
 * errorHandler — Middleware xử lý lỗi toàn cục
 *
 * Đặt SAU tất cả routes trong server.js:
 *   app.use(errorHandler);
 *
 * Tự động bắt mọi error được throw hoặc next(err) từ controller/service,
 * phân loại AppError (nghiệp vụ) vs Error (hệ thống), trả response chuẩn.
 */
const AppError = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
  // Ghi log lỗi (production nên dùng winston/pino thay console)
  console.error(`[LỖI] ${err.statusCode || 500} — ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // ─── Lỗi nghiệp vụ (AppError) ───
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.errorCode,
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
      },
    });
  }

  // ─── Lỗi Joi Validation ───
  if (err.isJoi || err.name === 'ValidationError') {
    const details = err.details
      ? err.details.map((d) => d.message).join(', ')
      : err.message;
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      error: {
        code: 'VALIDATION_ERROR',
        ...(process.env.NODE_ENV === 'development' ? { details } : {}),
      },
    });
  }

  // ─── Lỗi JWT ───
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ',
      error: { code: 'INVALID_TOKEN' },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token đã hết hạn',
      error: { code: 'TOKEN_EXPIRED' },
    });
  }

  // ─── Lỗi SQL Server (mssql) ───
  if (err.code === 'EREQUEST' || err.code === 'ECONNCLOSED') {
    return res.status(500).json({
      success: false,
      message: 'Lỗi truy vấn cơ sở dữ liệu',
      error: {
        code: 'DATABASE_ERROR',
        ...(process.env.NODE_ENV === 'development' ? { details: err.message } : {}),
      },
    });
  }

  // ─── Lỗi không xác định (500) ───
  return res.status(500).json({
    success: false,
    message: 'Lỗi hệ thống, vui lòng thử lại sau',
    error: {
      code: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' ? { details: err.message, stack: err.stack } : {}),
    },
  });
};

module.exports = errorHandler;
