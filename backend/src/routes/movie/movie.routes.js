const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/movie/movie.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { roleMiddleware } = require('../../middlewares/role.middleware');

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

module.exports = router;