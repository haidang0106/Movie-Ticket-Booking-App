const { AppError } = require('../utils');
const movieModel = require('../models/movie.model');

/**
 * Lấy danh sách phim có phân trang và bộ lọc
 */
const getAll = async ({ page = 1, limit = 20, filters = {} }) => {
  const offset = (page - 1) * limit;
  const { movies, total } = await movieModel.findAll({ offset, limit, filters });
  return { movies, total };
};

/**
 * Lấy danh sách phim nổi bật (từ cache hoặc DB)
 */
const getFeatured = async () => {
  // TODO: Triển khai Redis cache cho phim nổi bật
  const { movies } = await movieModel.findFeatured();
  return movies;
};

/**
 * Tìm kiếm phim theo từ khóa
 */
const searchMovies = async (query, { page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  const { movies, total } = await movieModel.search(query, { offset, limit });
  return { movies, total };
};

/**
 * Lấy chi tiết phim theo ID
 */
const getById = async (id) => {
  const movie = await movieModel.findById(id);
  if (!movie) {
    throw AppError.notFound('Phim không tồn tại', 'MOVIE_NOT_FOUND');
  }
  return movie;
};

/**
 * Thêm phim mới
 */
const create = async (movieData) => {
  // Kiểm tra trường bắt buộc
  const requiredFields = ['title', 'genre', 'language', 'runtime', 'releaseDate'];
  for (const field of requiredFields) {
    if (!movieData[field]) {
      throw AppError.badRequest(`${field} là bắt buộc`, `MISSING_${field.toUpperCase()}`);
    }
  }
  
  const movie = await movieModel.create(movieData);
  return movie;
};

/**
 * Cập nhật thông tin phim
 */
const update = async (id, movieData) => {
  const movie = await movieModel.findById(id);
  if (!movie) {
    throw AppError.notFound('Phim không tồn tại', 'MOVIE_NOT_FOUND');
  }
  
  // Gộp dữ liệu hiện tại với dữ liệu cập nhật (giữ giá trị cũ nếu không truyền)
  const mergedData = {
    title: movieData.title !== undefined ? movieData.title : movie.MovieTitle,
    genre: movieData.genre !== undefined ? movieData.genre : movie.MovieGenre,
    language: movieData.language !== undefined ? movieData.language : movie.MovieLanguage,
    runtime: movieData.runtime !== undefined ? movieData.runtime : movie.MovieRuntime,
    releaseDate: movieData.releaseDate !== undefined ? movieData.releaseDate : movie.MovieReleaseDate,
    actor: movieData.actor !== undefined ? movieData.actor : movie.MovieActor,
    director: movieData.director !== undefined ? movieData.director : movie.MovieDirector,
    description: movieData.description !== undefined ? movieData.description : movie.MovieDescription,
    trailerUrl: movieData.trailerUrl !== undefined ? movieData.trailerUrl : movie.TrailerUrl,
    rating: movieData.rating !== undefined ? movieData.rating : movie.Rating,
    isFeatured: movieData.isFeatured !== undefined ? movieData.isFeatured : movie.IsFeatured,
    featuredOrder: movieData.featuredOrder !== undefined ? movieData.featuredOrder : movie.FeaturedOrder,
    isActive: movieData.isActive !== undefined ? movieData.isActive : movie.IsActive
  };
  
  const updatedMovie = await movieModel.update(id, mergedData);
  return updatedMovie;
};

/**
 * Xóa mềm phim (set IsActive = 0)
 */
const deleteMovie = async (id) => {
  const movie = await movieModel.findById(id);
  if (!movie) {
    throw AppError.notFound('Phim không tồn tại', 'MOVIE_NOT_FOUND');
  }
  
  await movieModel.softDelete(id);
  return movie;
};

/**
 * Bật/tắt trạng thái phim nổi bật
 */
const toggleFeatured = async (id) => {
  const movie = await movieModel.findById(id);
  if (!movie) {
    throw AppError.notFound('Phim không tồn tại', 'MOVIE_NOT_FOUND');
  }
  
  const result = await movieModel.toggleFeatured(id);
  return result;
};

/**
 * Thích/bỏ thích phim
 */
const likeMovie = async (movieId, customerId) => {
  const movie = await movieModel.findById(movieId);
  if (!movie) {
    throw AppError.notFound('Phim không tồn tại', 'MOVIE_NOT_FOUND');
  }
  
  const liked = await movieModel.toggleLike(movieId, customerId);
  return liked;
};

module.exports = {
  getAll,
  getFeatured,
  searchMovies,
  getById,
  create,
  update,
  delete: deleteMovie,
  toggleFeatured,
  likeMovie
};