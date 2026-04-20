const express = require('express');
const router = express.Router();
const showController = require('../../controllers/show/show.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../middlewares/role.middleware');

// === Route công khai ===
router.get('/', showController.getShows);                                    // Danh sách suất chiếu
router.get('/:id', showController.getShowById);                              // Chi tiết suất chiếu
router.get('/:id/seats', showController.getShowSeats);                       // Sơ đồ ghế cho suất chiếu
router.get('/cinema/:cinemaId/shows', showController.getShowsByCinemaAndDate); // Lịch chiếu theo cụm rạp

// === Route quản trị (chỉ ADMIN/SUPER_ADMIN) ===
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), showController.createShow);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), showController.updateShow);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), showController.deleteShow);

module.exports = router;