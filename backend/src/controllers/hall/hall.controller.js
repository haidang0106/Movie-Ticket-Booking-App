const { ApiResponse, AppError, asyncHandler } = require('../../utils');
const hallService = require('../../services/hall.service');

// GET /api/halls/:cinemaId — Danh sách phòng chiếu của cụm rạp
const getHallsByCinemaId = asyncHandler(async (req, res) => {
  const { cinemaId } = req.params;
  const halls = await hallService.getByCinema(cinemaId);
  return ApiResponse.ok(res, halls);
});

// GET /api/halls/:hallId/seats — Sơ đồ ghế của phòng chiếu
const getHallSeats = asyncHandler(async (req, res) => {
  const { hallId } = req.params;
  const seats = await hallService.getSeatsByHallId(hallId);
  return ApiResponse.ok(res, seats);
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

// PUT /api/admin/halls/:hallId/seats — Thiết lập sơ đồ ghế (Admin)
const setupHallSeats = asyncHandler(async (req, res) => {
  const { hallId } = req.params;
  const { seats } = req.body;
  
  if (!Array.isArray(seats)) {
    throw AppError.badRequest('Dữ liệu ghế phải là mảng', 'SEATS_DATA_INVALID');
  }
  
  const result = await hallService.setupSeats(hallId, seats);
  return ApiResponse.ok(res, result, 'Thiết lập sơ đồ ghế thành công');
});

module.exports = {
  getHallsByCinemaId,
  getHallSeats,
  createHall,
  updateHall,
  setupHallSeats
};