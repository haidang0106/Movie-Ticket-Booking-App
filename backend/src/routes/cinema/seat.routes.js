const express = require('express');
const router = express.Router();
const hallController = require('../../controllers/cinema/hall.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../middlewares/role.middleware');

// === Route công khai — sơ đồ ghế ===
router.get('/halls/:hallId/seats', hallController.getHallSeats);   // Lấy sơ đồ ghế

// === Route quản trị — thiết lập sơ đồ ghế ===
router.put('/halls/:hallId/seats', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), hallController.setupSeats);

module.exports = router;