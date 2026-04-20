const { ApiResponse, AppError, asyncHandler } = require('../../../utils');
const showService = require('../../../services/show.service');

// POST /api/admin/shows — Tạo suất chiếu (Admin)
const createShow = asyncHandler(async (req, res) => {
  const show = await showService.create(req.body, req.user.accountId);
  return ApiResponse.created(res, show, 'Tạo suất chiếu thành công');
});

// PUT /api/admin/shows/:id — Cập nhật suất chiếu (Admin)
const updateShow = asyncHandler(async (req, res) => {
  const show = await showService.update(req.params.id, req.body, req.user.accountId);
  return ApiResponse.ok(res, show, 'Cập nhật suất chiếu thành công');
});

// DELETE /api/admin/shows/:id — Xóa suất chiếu (Admin)
const deleteShow = asyncHandler(async (req, res) => {
  await showService.delete(req.params.id);
  return ApiResponse.ok(res, null, 'Xóa suất chiếu thành công');
});

module.exports = {
  createShow,
  updateShow,
  deleteShow
};