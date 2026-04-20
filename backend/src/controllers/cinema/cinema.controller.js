const { ApiResponse, AppError, asyncHandler } = require('../../utils');
const cinemaService = require('../../services/cinema.service');

// GET /api/cinemas — Danh sách cụm rạp
const getCinemas = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, cityId } = req.query;
  const filters = {};
  if (cityId) filters.cityId = cityId;
  
  const { cinemas, total } = await cinemaService.getAll({ page, limit, filters });
  return ApiResponse.paginate(res, cinemas, { page, limit, total });
});

// GET /api/cinemas/:id — Chi tiết cụm rạp (kèm tên thành phố)
const getCinemaById = asyncHandler(async (req, res) => {
  const cinema = await cinemaService.getById(req.params.id);
  return ApiResponse.ok(res, cinema);
});

// POST /api/admin/cinemas — Thêm cụm rạp (Admin)
const createCinema = asyncHandler(async (req, res) => {
  const cinema = await cinemaService.create(req.body);
  return ApiResponse.created(res, cinema, 'Thêm cụm rạp thành công');
});

// PUT /api/admin/cinemas/:id — Sửa thông tin cụm rạp (Admin)
const updateCinema = asyncHandler(async (req, res) => {
  const cinema = await cinemaService.update(req.params.id, req.body);
  return ApiResponse.ok(res, cinema, 'Cập nhật cụm rạp thành công');
});

module.exports = {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema
};