const { ApiResponse, AppError, asyncHandler } = require('../../../utils');
const cinemaService = require('../../../services/cinema.service');

// POST /api/admin/cinemas — Thêm cụm rạp (Admin)
const createCinema = asyncHandler(async (req, res) => {
  const cinema = await cinemaService.create(req.body, req.user.accountId);
  return ApiResponse.created(res, cinema, 'Thêm cụm rạp thành công');
});

// PUT /api/admin/cinemas/:id — Sửa thông tin cụm rạp (Admin)
const updateCinema = asyncHandler(async (req, res) => {
  const cinema = await cinemaService.update(req.params.id, req.body, req.user.accountId);
  if (!cinema) {
    throw AppError.notFound('Cụm rạp không tồn tại', 'CINEMA_NOT_FOUND');
  }
  return ApiResponse.ok(res, cinema, 'Cập nhật cụm rạp thành công');
});

module.exports = {
  createCinema,
  updateCinema
};