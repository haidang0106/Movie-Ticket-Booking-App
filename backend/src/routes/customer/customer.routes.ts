import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';

// TODO: Import Controller khi bạn tạo xong file này
// import { CustomerController } from '../../controllers/customer/customer.controller';

const router = Router();

// ================================
// CUSTOMER — Tài khoản khách hàng
// ================================

/**
 * 🔒 Yêu cầu xác thực JWT cho tất cả các route của customer
 * Thay vì gắn authMiddleware vào từng route, ta gắn cho toàn bộ router
 */
router.use(authMiddleware);

/**
 * Các route dưới đây đã được định nghĩa theo chuẩn thiết kế từ AGENTS.md.
 * Vui lòng tạo file customer.controller.ts, sau đó gỡ comment để sử dụng.
 */

// GET /api/customer/profile → Xem thông tin tài khoản
// router.get('/profile', CustomerController.getProfile);

// PUT /api/customer/profile → Sửa thông tin (họ tên, SĐT, giới tính, DOB)
// router.put('/profile', CustomerController.updateProfile);

// PUT /api/customer/avatar → Upload ảnh đại diện (Cloudinary)
// Lưu ý: Bạn sẽ cần thêm một middleware xử lý file upload (ví dụ: multer) ở trước controller
// router.put('/avatar', uploadMiddleware.single('avatar'), CustomerController.uploadAvatar);

// GET /api/customer/loyalty-points → Xem điểm tích lũy & lịch sử điểm
// router.get('/loyalty-points', CustomerController.getLoyaltyPoints);

// GET /api/customer/vouchers → Xem kho voucher cá nhân
// router.get('/vouchers', CustomerController.getVouchers);

export default router;
