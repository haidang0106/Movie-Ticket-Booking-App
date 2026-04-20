const { ApiResponse, AppError, asyncHandler } = require('../../utils');
const showService = require('../../services/show.service');

// GET /api/shows — Danh sách suất chiếu
const getShows = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, movieId, cinemaId, date, format } = req.query;
  const filters = {};
  if (movieId) filters.movieId = movieId;
  if (cinemaId) filters.cinemaId = cinemaId;
  if (date) filters.date = date;
  if (format) filters.format = format;
  
  const { shows, total } = await showService.getAll({ page, limit, filters });
  return ApiResponse.paginate(res, shows, { page, limit, total });
});

// GET /api/shows/:id — Chi tiết suất chiếu
const getShowById = asyncHandler(async (req, res) => {
  const show = await showService.getById(req.params.id);
  return ApiResponse.ok(res, show);
});

// GET /api/shows/:id/seats — Sơ đồ ghế cho suất chiếu
const getShowSeats = asyncHandler(async (req, res) => {
  const seats = await showService.getShowSeats(req.params.id);
  return ApiResponse.ok(res, seats);
});

// POST /api/admin/shows — Tạo suất chiếu (Admin)
const createShow = asyncHandler(async (req, res) => {
  const show = await showService.create(req.body);
  return ApiResponse.created(res, show, 'Tạo suất chiếu thành công');
});

// PUT /api/admin/shows/:id — Cập nhật suất chiếu (Admin)
const updateShow = asyncHandler(async (req, res) => {
  const show = await showService.update(req.params.id, req.body);
  return ApiResponse.ok(res, show, 'Cập nhật suất chiếu thành công');
});

// DELETE /api/admin/shows/:id — Xóa suất chiếu (Admin)
const deleteShow = asyncHandler(async (req, res) => {
  await showService.delete(req.params.id);
  return ApiResponse.ok(res, null, 'Xóa suất chiếu thành công');
});

// GET /api/cinemas/:cinemaId/shows — Lịch chiếu theo cụm rạp và ngày
const getShowsByCinemaAndDate = asyncHandler(async (req, res) => {
  const { cinemaId } = req.params;
  const { date } = req.query;
  
  if (!date) {
    throw AppError.badRequest('Tham số date là bắt buộc', 'DATE_REQUIRED');
  }
  
  const shows = await showService.getByCinemaAndDate(cinemaId, date);
  return ApiResponse.ok(res, shows);
});

module.exports = {
  getShows,
  getShowById,
  getShowSeats,
  createShow,
  updateShow,
  deleteShow,
  getShowsByCinemaAndDate
};