const express = require('express');
const router = express.Router();
const cinemaController = require('../../controllers/cinema/cinema.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../middlewares/role.middleware');

// === Route công khai ===
router.get('/', cinemaController.getCinemas);       // Danh sách cụm rạp
router.get('/:id', cinemaController.getCinemaById); // Chi tiết cụm rạp

// === Route quản trị (chỉ ADMIN/SUPER_ADMIN) ===
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), cinemaController.createCinema);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), cinemaController.updateCinema);

module.exports = router;