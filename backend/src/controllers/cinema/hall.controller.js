const { ApiResponse, AppError, asyncHandler } = require('../../utils');
const hallService = require('../../services/hall.service');

// GET /api/cinemas/:cinemaId/halls — Danh sách phòng chiếu của cụm rạp
const getHallsByCinema = asyncHandler(async (req, res) => {
  const { cinemaId } = req.params;
  const halls = await hallService.getByCinema(cinemaId);
  return ApiResponse.ok(res, halls);
});

// GET /api/halls/:id — Chi tiết phòng chiếu
const getHallById = asyncHandler(async (req, res) => {
  const hall = await hallService.getById(req.params.id);
  return ApiResponse.ok(res, hall);
});

// GET /api/halls/:hallId/seats — Sơ đồ ghế của phòng chiếu
const getHallSeats = asyncHandler(async (req, res) => {
  const { hallId } = req.params;
  const seats = await hallService.getSeatsByHallId(hallId);
  return ApiResponse.ok(res, seats);
});

// PUT /api/admin/cinemas/:cinemaId/halls — Cấu hình phòng chiếu (Admin)
const configureHalls = asyncHandler(async (req, res) => {
  const { cinemaId } = req.params;
  const { halls } = req.body;
  if (!Array.isArray(halls)) {
    throw AppError.badRequest('Dữ liệu phòng chiếu phải là mảng', 'INVALID_HALLS_DATA');
  }
  const result = await hallService.configureHalls(cinemaId, halls);
  return ApiResponse.ok(res, result, 'Cấu hình phòng chiếu thành công');
});

// PUT /api/admin/halls/:hallId/seats — Thiết lập sơ đồ ghế (Admin)
const setupSeats = asyncHandler(async (req, res) => {
  const { hallId } = req.params;
  const { seats } = req.body;
  if (!Array.isArray(seats)) {
    throw AppError.badRequest('Dữ liệu ghế phải là mảng', 'INVALID_SEATS_DATA');
  }
  const result = await hallService.setupSeats(hallId, seats);
  return ApiResponse.ok(res, result, 'Thiết lập sơ đồ ghế thành công');
});

// POST /api/admin/halls — Thêm phòng chiếu (Admin)
const createHall = asyncHandler(async (req, res) => {
  const hall = await hallService.create(req.body);
  return ApiResponse.created(res, hall, 'Thêm phòng chiếu thành công');
});

// PUT /api/admin/halls/:id — Sửa thông tin phòng chiếu (Admin)
const updateHall = asyncHandler(async (req, res) => {
  const hall = await hallService.update(req.params.id, req.body);
  return ApiResponse.ok(res, hall, 'Cập nhật phòng chiếu thành công');
});

module.exports = {
  getHallsByCinema,
  getHallById,
  getHallSeats,
  configureHalls,
  setupSeats,
  createHall,
  updateHall
};