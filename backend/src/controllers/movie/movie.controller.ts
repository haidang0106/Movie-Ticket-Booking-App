import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/helpers/async.handler';
import { AppException } from '../../utils/exceptions/app.exception';
import { ErrorCode } from '../../utils/exceptions/error.code';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import * as movieService from '../../services/movie.service';

// GET /api/movies — Danh sách phim đang chiếu
export const getMovies = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, genre, language } = req.query;
  const filters: Record<string, any> = {};
  if (genre) filters.genre = genre;
  if (language) filters.language = language;
  
  const { movies, total } = await movieService.getAll({ 
    page: Number(page), 
    limit: Number(limit), 
    filters 
  });

  return res.status(200).json({
    success: true,
    data: movies,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// GET /api/movies/featured — Danh sách phim nổi bật (từ Redis cache)
export const getFeaturedMovies = asyncHandler(async (req: Request, res: Response) => {
  const movies = await movieService.getFeatured();
  return res.status(200).json({ success: true, data: movies });
});

// GET /api/movies/search?q= — Tìm kiếm phim (theo tên, thể loại, ngôn ngữ)
export const searchMovies = asyncHandler(async (req: Request, res: Response) => {
  const { q, page = 1, limit = 20 } = req.query;
  if (!q) {
    throw new AppException(ErrorCode.INVALID_DATA);
  }
  
  const { movies, total } = await movieService.searchMovies(q as string, { 
    page: Number(page), 
    limit: Number(limit) 
  });

  return res.status(200).json({
    success: true,
    data: movies,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// GET /api/movies/:id — Chi tiết phim
export const getMovieById = asyncHandler(async (req: Request, res: Response) => {
  const movie = await movieService.getById(Number(req.params.id));
  return res.status(200).json({ success: true, data: movie });
});

// POST /api/admin/movies — Thêm phim (Admin)
export const createMovie = asyncHandler(async (req: Request, res: Response) => {
  const movie = await movieService.create(req.body);
  return res.status(201).json({ success: true, data: movie, message: 'Thêm phim thành công' });
});

// PUT /api/admin/movies/:id — Sửa phim (Admin)
export const updateMovie = asyncHandler(async (req: Request, res: Response) => {
  const movie = await movieService.update(Number(req.params.id), req.body);
  return res.status(200).json({ success: true, data: movie, message: 'Cập nhật phim thành công' });
});

// DELETE /api/admin/movies/:id — Xóa phim (Admin, soft delete)
export const deleteMovie = asyncHandler(async (req: Request, res: Response) => {
  await movieService.deleteMovie(Number(req.params.id));
  return res.status(200).json({ success: true, data: null, message: 'Xóa phim thành công' });
});

// PUT /api/admin/movies/:id/featured — Đánh dấu/bỏ phim nổi bật (Admin)
export const toggleFeaturedMovie = asyncHandler(async (req: Request, res: Response) => {
  const movie = await movieService.toggleFeatured(Number(req.params.id));
  const message = movie.IsFeatured 
    ? 'Đánh dấu phim nổi bật thành công' 
    : 'Bỏ đánh dấu phim nổi bật thành công';
  return res.status(200).json({ success: true, data: movie, message });
});

// POST /api/movies/:id/like — Yêu thích/bỏ yêu thích phim
export const likeMovie = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const liked = await movieService.likeMovie(Number(req.params.id), req.user!.customerId);
  return res.status(200).json({ 
    success: true, 
    data: { liked }, 
    message: liked ? 'Yêu thích phim thành công' : 'Bỏ yêu thích phim thành công' 
  });
});
