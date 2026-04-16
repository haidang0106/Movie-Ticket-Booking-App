/**
 * AppError — Custom error class cho toàn bộ business logic errors
 *
 * Kết hợp với errorHandler middleware để tự động trả response chuẩn.
 *
 * Ví dụ:
 *   throw new AppError('Ghế đã được đặt bởi người khác', 409, 'SEAT_ALREADY_BOOKED');
 *   throw new AppError('OTP không đúng hoặc đã hết hạn', 400, 'INVALID_OTP');
 *   throw new AppError('Vượt quá giới hạn gửi OTP', 429, 'OTP_THROTTLE_EXCEEDED');
 */
class AppError extends Error {
  /**
   * @param {string} message - Thông báo lỗi (hiển thị cho client)
   * @param {number} statusCode - HTTP status code
   * @param {string} errorCode - Mã lỗi ứng dụng (UPPER_SNAKE_CASE)
   */
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Phân biệt lỗi nghiệp vụ vs lỗi hệ thống

    // Giữ stack trace chính xác
    Error.captureStackTrace(this, this.constructor);
  }
}

// ========================
// Các error thường dùng — Factory methods
// ========================

/**
 * 400 — Validation / Bad Request
 */
AppError.badRequest = (message = 'Dữ liệu không hợp lệ', errorCode = 'BAD_REQUEST') =>
  new AppError(message, 400, errorCode);

/**
 * 401 — Chưa xác thực
 */
AppError.unauthorized = (message = 'Chưa xác thực', errorCode = 'UNAUTHORIZED') =>
  new AppError(message, 401, errorCode);

/**
 * 403 — Không có quyền
 */
AppError.forbidden = (message = 'Không có quyền truy cập', errorCode = 'FORBIDDEN') =>
  new AppError(message, 403, errorCode);

/**
 * 404 — Không tìm thấy
 */
AppError.notFound = (message = 'Không tìm thấy tài nguyên', errorCode = 'NOT_FOUND') =>
  new AppError(message, 404, errorCode);

/**
 * 409 — Xung đột (ghế đã đặt, voucher đã dùng)
 */
AppError.conflict = (message = 'Xung đột dữ liệu', errorCode = 'CONFLICT') =>
  new AppError(message, 409, errorCode);

/**
 * 422 — Vi phạm ràng buộc nghiệp vụ
 */
AppError.unprocessable = (message = 'Vi phạm ràng buộc nghiệp vụ', errorCode = 'UNPROCESSABLE_ENTITY') =>
  new AppError(message, 422, errorCode);

/**
 * 429 — Rate limit
 */
AppError.tooManyRequests = (message = 'Quá nhiều yêu cầu', errorCode = 'TOO_MANY_REQUESTS') =>
  new AppError(message, 429, errorCode);

module.exports = AppError;
