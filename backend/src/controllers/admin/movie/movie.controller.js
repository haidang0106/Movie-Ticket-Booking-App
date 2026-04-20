const { ApiResponse, AppError, asyncHandler } = require('../../../utils');
const movieService = require('../../../services/movie.service');

// POST /api/admin/movies — Thêm phim (Admin)
const createMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.create(req.body, req.user.accountId);
  return ApiResponse.created(res, movie, 'Thêm phim thành công');
});

// PUT /api/admin/movies/:id — Sửa phim (Admin)
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.update(req.params.id, req.body, req.user.accountId);
  if (!movie) {
    throw AppError.notFound('Phim không tồn tại', 'MOVIE_NOT_FOUND');
  }
  return ApiResponse.ok(res, movie, 'Cập nhật phim thành công');
});

// DELETE /api/admin/movies/:id — Xóa phim (Admin)
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.delete(req.params.id, req.user.accountId);
  if (!movie) {
    throw AppError.notFound('Phim không tồn tại', 'MOVIE_NOT_FOUND');
  }
  return ApiResponse.ok(res, null, 'Xóa phim thành công');
});

// PUT /api/admin/movies/:id/featured — Đánh dấu/bỏ phim nổi bật (Admin)
const toggleFeaturedMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.toggleFeatured(req.params.id, req.user.accountId);
  if (!movie) {
    throw AppError.notFound('Phim không tồn tại', 'MOVIE_NOT_FOUND');
  }
  return ApiResponse.ok(res, movie, movie.isFeatured ? 'Đánh dấu phim nổi bật thành công' : 'Bỏ đánh dấu phim nổi bật thành công');
});

module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  toggleFeaturedMovie
};