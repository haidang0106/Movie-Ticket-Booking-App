import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';

// TODO: Import Controller & Validator khi bạn tạo xong các file này
// import { AuthController } from '../../controllers/auth/auth.controller';
// import { AuthValidator } from '../../validators/auth.validator';

const router = Router();

// ================================
// AUTH — Xác thực & Đăng ký
// ================================

/**
 * Các route dưới đây đã được định nghĩa theo chuẩn thiết kế từ AGENTS.md.
 * Vui lòng tạo file auth.controller.ts, sau đó gỡ comment (uncomment) để sử dụng.
 */

// POST /api/auth/register → Đăng ký tài khoản (gửi OTP)
// router.post('/register', AuthValidator.register, AuthController.register);

// POST /api/auth/verify-otp → Xác minh OTP đăng ký
// router.post('/verify-otp', AuthValidator.verifyOtp, AuthController.verifyOtp);

// POST /api/auth/resend-otp → Gửi lại OTP (throttle 3/15 phút)
// router.post('/resend-otp', AuthValidator.resendOtp, AuthController.resendOtp);

// POST /api/auth/login → Đăng nhập (trả JWT Access + Refresh)
// router.post('/login', AuthValidator.login, AuthController.login);

// POST /api/auth/refresh-token → Làm mới Access Token
// router.post('/refresh-token', AuthValidator.refreshToken, AuthController.refreshToken);

// POST /api/auth/forgot-password → Gửi OTP đặt lại mật khẩu
// router.post('/forgot-password', AuthValidator.forgotPassword, AuthController.forgotPassword);

// POST /api/auth/reset-password → Xác minh OTP + đặt mật khẩu mới
// router.post('/reset-password', AuthValidator.resetPassword, AuthController.resetPassword);

// POST /api/auth/change-password → Đổi mật khẩu (khi đã đăng nhập)
// Cần đi qua authMiddleware để kiểm tra token trước
// router.post('/change-password', authMiddleware, AuthValidator.changePassword, AuthController.changePassword);

// POST /api/auth/logout → Đăng xuất (blacklist token)
// router.post('/logout', authMiddleware, AuthController.logout);

export default router;
