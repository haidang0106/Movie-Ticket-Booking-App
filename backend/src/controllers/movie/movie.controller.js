const { ApiResponse, AppError, asyncHandler } = require('../../utils');
const movieService = require('../../services/movie.service');

// GET /api/movies — Danh sách phim đang chiếu
const getMovies = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, genre, language } = req.query;
  const filters = {};
  if (genre) filters.genre = genre;
  if (language) filters.language = language;
  
  const { movies, total } = await movieService.getAll({ page, limit, filters });
  return ApiResponse.paginate(res, movies, { page, limit, total });
});

// GET /api/movies/featured — Danh sách phim nổi bật (từ Redis cache)
const getFeaturedMovies = asyncHandler(async (req, res) => {
  const movies = await movieService.getFeatured();
  return ApiResponse.ok(res, movies);
});

// GET /api/movies/search?q= — Tìm kiếm phim (theo tên, thể loại, ngôn ngữ)
const searchMovies = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  if (!q) {
    throw AppError.badRequest('Từ khóa tìm kiếm là bắt buộc', 'SEARCH_QUERY_REQUIRED');
  }
  
  const { movies, total } = await movieService.searchMovies(q, { page, limit });
  return ApiResponse.paginate(res, movies, { page, limit, total });
});

// GET /api/movies/:id — Chi tiết phim
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await movieService.getById(req.params.id);
  return ApiResponse.ok(res, movie);
});

// POST /api/admin/movies — Thêm phim (Admin)
const createMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.create(req.body);
  return ApiResponse.created(res, movie, 'Thêm phim thành công');
});

// PUT /api/admin/movies/:id — Sửa phim (Admin)
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.update(req.params.id, req.body);
  return ApiResponse.ok(res, movie, 'Cập nhật phim thành công');
});

// DELETE /api/admin/movies/:id — Xóa phim (Admin, soft delete)
const deleteMovie = asyncHandler(async (req, res) => {
  await movieService.delete(req.params.id);
  return ApiResponse.ok(res, null, 'Xóa phim thành công');
});

// PUT /api/admin/movies/:id/featured — Đánh dấu/bỏ phim nổi bật (Admin)
const toggleFeaturedMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.toggleFeatured(req.params.id);
  const message = movie.IsFeatured 
    ? 'Đánh dấu phim nổi bật thành công' 
    : 'Bỏ đánh dấu phim nổi bật thành công';
  return ApiResponse.ok(res, movie, message);
});

// POST /api/movies/:id/like — Yêu thích/bỏ yêu thích phim
const likeMovie = asyncHandler(async (req, res) => {
  const liked = await movieService.likeMovie(req.params.id, req.user.customerId);
  return ApiResponse.ok(res, { liked }, liked ? 'Yêu thích phim thành công' : 'Bỏ yêu thích phim thành công');
});

module.exports = {
  getMovies,
  getFeaturedMovies,
  searchMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  toggleFeaturedMovie,
  likeMovie
};