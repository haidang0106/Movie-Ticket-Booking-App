import { Router } from 'express';
import * as showController from '../../controllers/show/show.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';

const router = Router();

// === Route công khai (không cần đăng nhập) ===
router.get('/:id', showController.getShowById);                    // Chi tiết suất chiếu
router.get('/:id/seats', showController.getShowSeats);            // Sơ đồ ghế

// === Route quản trị (chỉ ADMIN/SUPER_ADMIN) ===
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), showController.createShow);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), showController.updateShow);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SUPER_ADMIN']), showController.deleteShow);

export default router;
