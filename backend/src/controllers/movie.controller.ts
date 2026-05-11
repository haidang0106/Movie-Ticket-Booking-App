import { ApiResponse, AppError, asyncHandler } from('../../utils');
import MovieService from('../../services/movie.service');

// GET /api/movies — Danh sách phim (phân trang)
const getMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  const filters: any = {};
  if (req.query.genre) filters.genre = req.query.genre;
  if (req.query.language) filters.language = req.query.language;
  if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
  if (req.query.isFeatured !== undefined) filters.isFeatured = req.query.isFeatured === 'true';
  
  const { movies, total } = await MovieService.getAll({ page, limit, filters });
  return ApiResponse.paginate(res, movies, { page, limit, total });
});

// GET /api/movies/featured — Danh sách phim nổi bật
const getFeaturedMovies = asyncHandler(async (req, res) => {
  const { movies } = await MovieService.getFeatured();
  return ApiResponse.ok(res, movies);
});

// GET /api/movies/search?q= — Tìm kiếm phim
const searchMovies = asyncHandler(async (req, res) => {
  const query = req.query.q as string;
  if (!query) {
    throw AppError.badRequest('Từ khóa tìm kiếm là bắt buộc', 'SEARCH_QUERY_REQUIRED');
  }
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  const { movies, total } = await MovieService.search(query, { page, limit });
  return ApiResponse.paginate(res, movies, { page, limit, total });
});

// GET /api/movies/:id — Chi tiết phim
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await MovieService.getById(parseInt(req.params.id));
  return ApiResponse.ok(res, movie);
});

// POST /api/movies/:id/like — Thích phim
const toggleLikeMovie = asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.id);
  const customerId = req.user?.customerId;
  
  if (!customerId) {
    throw AppError.unauthorized('Chưa đăng nhập', 'NOT_AUTHENTICATED');
  }
  
  const isLiked = await MovieService.toggleLike(movieId, customerId);
  return ApiResponse.ok(res, { isLiked }, isLiked ? 'Đã thích phim' : 'Đã bỏ thích phim');
});

// DELETE /api/movies/:id/like — Bỏ thích phim (alias cho toggle)
const unlikeMovie = asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.id);
  const customerId = req.user?.customerId;
  
  if (!customerId) {
    throw AppError.unauthorized('Chưa đăng nhập', 'NOT_AUTHENTICATED');
  }
  
  await MovieService.toggleLike(movieId, customerId);
  return ApiResponse.ok(res, null, 'Đã bỏ thích phim');
});

// POST /api/admin/movies — Thêm phim (Admin)
const createMovie = asyncHandler(async (req, res) => {
  const movie = await MovieService.create(req.body);
  return ApiResponse.created(res, movie, 'Thêm phim thành công');
});

// PUT /api/admin/movies/:id — Sửa phim (Admin)
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await MovieService.update(parseInt(req.params.id), req.body);
  return ApiResponse.ok(res, movie, 'Cập nhật phim thành công');
});

// DELETE /api/admin/movies/:id — Xóa phim (Admin - soft delete)
const deleteMovie = asyncHandler(async (req, res) => {
  const result = await MovieService.delete(parseInt(req.params.id));
  return ApiResponse.ok(res, result, 'Xóa phim thành công');
});

// PUT /api/admin/movies/:id/featured — Bật/tắt phim nổi bật (Admin)
const toggleFeatured = asyncHandler(async (req, res) => {
  const movie = await MovieService.toggleFeatured(parseInt(req.params.id));
  const message = movie.IsFeatured ? 'Đã đánh dấu phim nổi bật' : 'Đã bỏ phim nổi bật';
  return ApiResponse.ok(res, movie, message);
});

module.exports = {
  getMovies,
  getFeaturedMovies,
  searchMovies,
  getMovieById,
  toggleLikeMovie,
  unlikeMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  toggleFeatured
};
