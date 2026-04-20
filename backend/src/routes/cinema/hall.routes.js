const express = require('express');
const router = express.Router();
const hallController = require('../../controllers/cinema/hall.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../middlewares/role.middleware');

// Public routes
router.get('/:cinemaId/halls', hallController.getHallsByCinema);
router.get('/halls/:id', hallController.getHallById);

// Admin routes - protected
router.put('/:cinemaId/halls', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), hallController.configureHalls);
router.put('/halls/:id/seats', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), hallController.setupSeats);

module.exports = router;