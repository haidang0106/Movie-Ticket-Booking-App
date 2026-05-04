import { MovieModel, MovieData, MovieFilters } from '../models/movie.model';
import { AppException } from '../utils/exceptions/app.exception';
import { ErrorCode } from '../utils/exceptions/error.code';

/**
 * Lấy danh sách phim có phân trang và bộ lọc
 */
export const getAll = async ({ page = 1, limit = 20, filters = {} }: { page?: number; limit?: number; filters?: MovieFilters }) => {
  const offset = (page - 1) * limit;
  const { movies, total } = await MovieModel.findAll({ offset, limit, filters });
  return { movies, total };
};

/**
 * Lấy danh sách phim nổi bật (từ cache hoặc DB)
 */
export const getFeatured = async () => {
  // TODO: Triển khai Redis cache cho phim nổi bật
  const { movies } = await MovieModel.findFeatured();
  return movies;
};

/**
 * Tìm kiếm phim theo từ khóa
 */
export const searchMovies = async (query: string, { page = 1, limit = 20 }: { page?: number; limit?: number }) => {
  const offset = (page - 1) * limit;
  const { movies, total } = await MovieModel.search(query, { offset, limit });
  return { movies, total };
};

/**
 * Lấy chi tiết phim theo ID
 */
export const getById = async (id: number) => {
  const movie = await MovieModel.findById(id);
  if (!movie) {
    throw new AppException(ErrorCode.USER_NOT_EXISTED); // TODO: Thêm MOVIE_NOT_FOUND vào ErrorCode
  }
  return movie;
};

/**
 * Thêm phim mới
 */
export const create = async (movieData: MovieData) => {
  // Kiểm tra trường bắt buộc
  const requiredFields: (keyof MovieData)[] = ['title', 'genre', 'language', 'runtime', 'releaseDate'];
  for (const field of requiredFields) {
    if (!movieData[field]) {
      throw new AppException(ErrorCode.INVALID_DATA);
    }
  }
  
  const movie = await MovieModel.create(movieData);
  return movie;
};

/**
 * Cập nhật thông tin phim
 */
export const update = async (id: number, movieData: Partial<MovieData>) => {
  const movie = await MovieModel.findById(id);
  if (!movie) {
    throw new AppException(ErrorCode.USER_NOT_EXISTED); // TODO: Thêm MOVIE_NOT_FOUND vào ErrorCode
  }
  
  // Gộp dữ liệu hiện tại với dữ liệu cập nhật (giữ giá trị cũ nếu không truyền)
  const mergedData: MovieData = {
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
  
  const updatedMovie = await MovieModel.update(id, mergedData);
  return updatedMovie;
};

/**
 * Xóa mềm phim (set IsActive = 0)
 */
export const deleteMovie = async (id: number) => {
  const movie = await MovieModel.findById(id);
  if (!movie) {
    throw new AppException(ErrorCode.USER_NOT_EXISTED); // TODO: Thêm MOVIE_NOT_FOUND vào ErrorCode
  }
  
  await MovieModel.softDelete(id);
  return movie;
};

/**
 * Bật/tắt trạng thái phim nổi bật
 */
export const toggleFeatured = async (id: number) => {
  const movie = await MovieModel.findById(id);
  if (!movie) {
    throw new AppException(ErrorCode.USER_NOT_EXISTED); // TODO: Thêm MOVIE_NOT_FOUND vào ErrorCode
  }
  
  const result = await MovieModel.toggleFeatured(id);
  return result;
};

/**
 * Thích/bỏ thích phim
 */
export const likeMovie = async (movieId: number, customerId: number) => {
  const movie = await MovieModel.findById(movieId);
  if (!movie) {
    throw new AppException(ErrorCode.USER_NOT_EXISTED); // TODO: Thêm MOVIE_NOT_FOUND vào ErrorCode
  }
  
  const liked = await MovieModel.toggleLike(movieId, customerId);
  return liked;
};
