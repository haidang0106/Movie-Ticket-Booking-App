import { Router } from 'express';
import * as movieController from '../../controllers/movie/movie.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';

const router = Router();

// === Route công khai (không cần đăng nhập) ===
router.get('/', movieController.getMovies);                          // Danh sách phim
router.get('/featured', movieController.getFeaturedMovies);          // Phim nổi bật
router.get('/search', movieController.searchMovies);                 // Tìm kiếm phim
router.get('/:id', movieController.getMovieById);                    // Chi tiết phim
router.post('/:id/like', authMiddleware, movieController.likeMovie); // Yêu thích phim (cần đăng nhập)

// === Route quản trị (chỉ ADMIN/SUPER_ADMIN) ===
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), movieController.createMovie);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), movieController.updateMovie);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), movieController.deleteMovie);
router.put('/:id/featured', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), movieController.toggleFeaturedMovie);

export default router;
