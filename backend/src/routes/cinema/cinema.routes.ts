import { Router } from 'express';
import * as cinemaController from '../../controllers/cinema/cinema.controller';
import * as showController from '../../controllers/show/show.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';

const router = Router();

// === Route công khai (không cần đăng nhập) ===
router.get('/', cinemaController.getCinemas);                      // Danh sách cụm rạp
router.get('/cities', cinemaController.getCities);                  // Danh sách thành phố
router.get('/:id', cinemaController.getCinemaById);                // Chi tiết cụm rạp
router.get('/:id/shows', showController.getShowsByCinema);       // Lịch chiếu theo cụm rạp

// === Route quản trị (chỉ ADMIN/SUPER_ADMIN) ===
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), cinemaController.createCinema);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), cinemaController.updateCinema);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), cinemaController.deleteCinema);
router.get('/:id/halls', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), cinemaController.getHallsByCinema);
router.put('/:id/halls', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), cinemaController.createHall);
router.put('/halls/:id/seats', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), cinemaController.updateHallSeats);

export default router;
