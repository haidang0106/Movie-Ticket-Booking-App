const express = require('express');
const router = express.Router();
const hallController = require('../../controllers/hall/hall.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../middlewares/role.middleware');

// === Route công khai ===
router.get('/:cinemaId', hallController.getHallsByCinemaId);   // Danh sách phòng chiếu theo cụm rạp
router.get('/:hallId/seats', hallController.getHallSeats);     // Sơ đồ ghế của phòng chiếu

// === Route quản trị (chỉ ADMIN/SUPER_ADMIN) ===
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), hallController.createHall);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), hallController.updateHall);
router.put('/:hallId/seats', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), hallController.setupHallSeats);

module.exports = router;