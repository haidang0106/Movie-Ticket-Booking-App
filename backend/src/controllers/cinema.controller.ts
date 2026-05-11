import { ApiResponse, AppError, asyncHandler } from('../../utils');
import CinemaService from('../../services/cinema.service');

// GET /api/cinemas — Danh sách cụm rạp (phân trang)
const getCinemas = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  const filters: any = {};
  if (req.query.cityId) filters.cityId = parseInt(req.query.cityId as string);
  
  const { cinemas, total } = await CinemaService.getAll({ page, limit, filters });
  return ApiResponse.paginate(res, cinemas, { page, limit, total });
});

// GET /api/cinemas/:id — Chi tiết cụm rạp kèm phòng chiếu
const getCinemaById = asyncHandler(async (req, res) => {
  const result = await CinemaService.getById(parseInt(req.params.id));
  return ApiResponse.ok(res, result);
});

// GET /api/cinemas/:id/shows — Lịch chiếu theo cụm rạp
const getCinemaShows = asyncHandler(async (req, res) => {
  const date = req.query.date as string;
  const { shows } = await CinemaService.getShows(parseInt(req.params.id), date);
  return ApiResponse.ok(res, shows);
});

// POST /api/admin/cinemas — Thêm cụm rạp (Admin)
const createCinema = asyncHandler(async (req, res) => {
  const cinema = await CinemaService.create(req.body);
  return ApiResponse.created(res, cinema, 'Thêm cụm rạp thành công');
});

// PUT /api/admin/cinemas/:id — Sửa thông tin cụm rạp (Admin)
const updateCinema = asyncHandler(async (req, res) => {
  const cinema = await CinemaService.update(parseInt(req.params.id), req.body);
  return ApiResponse.ok(res, cinema, 'Cập nhật cụm rạp thành công');
});

module.exports = {
  getCinemas,
  getCinemaById,
  getCinemaShows,
  createCinema,
  updateCinema
};
