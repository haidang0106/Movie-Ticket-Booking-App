import { ApiResponse, AppError, asyncHandler } from('../../utils');
import ShowModel from('../../models/show.model');

// GET /api/shows/:id — Chi tiết suất chiếu
const getShowById = asyncHandler(async (req, res) => {
  const result = await ShowModel.findById(parseInt(req.params.id));
  
  if (!result) {
    throw AppError.notFound('Suất chiếu không tồn tại', 'SHOW_NOT_FOUND');
  }
  
  return ApiResponse.ok(res, result);
});

// GET /api/shows/:id/seats — Sơ đồ ghế kèm trạng thái realtime từ Redis
const getShowSeats = asyncHandler(async (req, res) => {
  const showId = parseInt(req.params.id);
  
  const { seats, show } = await ShowModel.getSeats(showId);
  
  // TODO: Kết hợp với Redis để lấy trạng thái realtime của ghế đang HOLDING
  // const redis = require('../../config/redis');
  // for (const seat of seats) {
  //   if (seat.Status === 'AVAILABLE') {
  //     const lockKey = `seat:hold:${showId}:${seat.SeatID}`;
  //     const lockHolder = await redis.get(lockKey);
  //     if (lockHolder) {
  //       seat.Status = 'HOLDING';
  //       seat.HoldBy = lockHolder;
  //     }
  //   }
  // }
  
  return ApiResponse.ok(res, {
    show,
    seats,
    seatTypes: {
      STANDARD: 'STANDARD',
      VIP: 'VIP',
      COUPLE: 'COUPLE',
      AISLE: 'AISLE',
      EMPTY: 'EMPTY'
    }
  });
});

// POST /api/admin/shows — Tạo suất chiếu (Admin)
const createShow = asyncHandler(async (req, res) => {
  const show = await ShowModel.create(req.body);
  return ApiResponse.created(res, show, 'Tạo suất chiếu thành công');
});

// PUT /api/admin/shows/:id — Cập nhật suất chiếu (Admin - chỉ khi chưa có vé)
const updateShow = asyncHandler(async (req, res) => {
  const show = await ShowModel.update(parseInt(req.params.id), req.body);
  return ApiResponse.ok(res, show, 'Cập nhật suất chiếu thành công');
});

// DELETE /api/admin/shows/:id — Xóa suất chiếu (Admin - kiểm tra không có vé)
const deleteShow = asyncHandler(async (req, res) => {
  const result = await ShowModel.delete(parseInt(req.params.id));
  return ApiResponse.ok(res, result, 'Xóa suất chiếu thành công');
});

module.exports = {
  getShowById,
  getShowSeats,
  createShow,
  updateShow,
  deleteShow
};
