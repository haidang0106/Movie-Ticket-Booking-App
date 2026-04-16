/**
 * asyncHandler — Wrapper tự động bắt lỗi cho async controller
 *
 * Thay vì viết try/catch trong mỗi controller, wrap handler bằng asyncHandler.
 * Mọi lỗi throw ra sẽ được chuyển tự động đến errorHandler middleware.
 *
 * Ví dụ:
 *   const asyncHandler = require('../utils/asyncHandler');
 *
 *   // Trước (phải viết try/catch mỗi hàm):
 *   const getMovies = async (req, res, next) => {
 *     try {
 *       const movies = await movieService.getAll();
 *       return ApiResponse.ok(res, movies);
 *     } catch (err) {
 *       next(err);
 *     }
 *   };
 *
 *   // Sau (gọn hơn):
 *   const getMovies = asyncHandler(async (req, res) => {
 *     const movies = await movieService.getAll();
 *     return ApiResponse.ok(res, movies);
 *   });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
