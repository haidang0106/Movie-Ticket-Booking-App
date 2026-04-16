/**
 * ApiResponse — Utility class chuẩn hóa toàn bộ response API
 *
 * Format thống nhất theo AGENTS.md:
 *
 * Success:  { success: true,  message, data }
 * Error:    { success: false, message, error: { code, details } }
 * Paginate: { success: true,  data, pagination: { page, limit, total, totalPages } }
 */
class ApiResponse {
  // ========================
  // SUCCESS RESPONSES
  // ========================

  /**
   * 200 OK — GET / UPDATE thành công
   */
  static ok(res, data = null, message = 'Thành công') {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * 201 Created — POST tạo mới thành công
   */
  static created(res, data = null, message = 'Tạo mới thành công') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * 200 OK — Trả về danh sách có phân trang
   * @param {Object} options - { page, limit, total }
   */
  static paginate(res, data = [], { page, limit, total }, message = 'Thành công') {
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
        totalPages,
      },
    });
  }

  // ========================
  // ERROR RESPONSES
  // ========================

  /**
   * 400 Bad Request — Validation error, dữ liệu không hợp lệ
   */
  static badRequest(res, message = 'Dữ liệu không hợp lệ', errorCode = 'BAD_REQUEST', details = null) {
    return res.status(400).json({
      success: false,
      message,
      error: {
        code: errorCode,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    });
  }

  /**
   * 401 Unauthorized — Chưa xác thực (missing/invalid token)
   */
  static unauthorized(res, message = 'Chưa xác thực', errorCode = 'UNAUTHORIZED', details = null) {
    return res.status(401).json({
      success: false,
      message,
      error: {
        code: errorCode,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    });
  }

  /**
   * 403 Forbidden — Không có quyền truy cập
   */
  static forbidden(res, message = 'Không có quyền truy cập', errorCode = 'FORBIDDEN', details = null) {
    return res.status(403).json({
      success: false,
      message,
      error: {
        code: errorCode,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    });
  }

  /**
   * 404 Not Found — Resource không tồn tại
   */
  static notFound(res, message = 'Không tìm thấy tài nguyên', errorCode = 'NOT_FOUND', details = null) {
    return res.status(404).json({
      success: false,
      message,
      error: {
        code: errorCode,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    });
  }

  /**
   * 409 Conflict — Xung đột dữ liệu (ghế đã đặt, voucher đã dùng)
   */
  static conflict(res, message = 'Xung đột dữ liệu', errorCode = 'CONFLICT', details = null) {
    return res.status(409).json({
      success: false,
      message,
      error: {
        code: errorCode,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    });
  }

  /**
   * 422 Unprocessable Entity — Vi phạm ràng buộc nghiệp vụ
   */
  static unprocessable(res, message = 'Vi phạm ràng buộc nghiệp vụ', errorCode = 'UNPROCESSABLE_ENTITY', details = null) {
    return res.status(422).json({
      success: false,
      message,
      error: {
        code: errorCode,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    });
  }

  /**
   * 429 Too Many Requests — Rate limit / OTP throttle
   */
  static tooManyRequests(res, message = 'Quá nhiều yêu cầu, vui lòng thử lại sau', errorCode = 'TOO_MANY_REQUESTS', details = null) {
    return res.status(429).json({
      success: false,
      message,
      error: {
        code: errorCode,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    });
  }

  /**
   * 500 Internal Server Error — Lỗi hệ thống
   */
  static internal(res, message = 'Lỗi hệ thống', errorCode = 'INTERNAL_ERROR', details = null) {
    return res.status(500).json({
      success: false,
      message,
      error: {
        code: errorCode,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    });
  }

  // ========================
  // GENERIC HELPER
  // ========================

  /**
   * Trả response với status code tùy ý
   */
  static send(res, statusCode, { success, message, data = null, error = null, pagination = null }) {
    const body = { success, message };
    if (data !== null) body.data = data;
    if (error !== null) body.error = error;
    if (pagination !== null) body.pagination = pagination;
    return res.status(statusCode).json(body);
  }
}

module.exports = ApiResponse;
