import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authValidator } from '../validators/auth.validator';

import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Định tuyến API Đăng ký yêu cầu cấp OTP
router.post('/register', authValidator.validateRegister, AuthController.register);

// Định tuyến API Xác nhận OTP để tạo tài khoản thật sự
router.post('/verify-otp', authValidator.validateVerifyOtp, AuthController.verifyOtp);

// Định tuyến API Đăng nhập tài khoản (cơ bản)
router.post('/login', authValidator.validateLogin, AuthController.login);

// Định tuyến API Refresh Token
router.post('/refresh-token', authValidator.validateRefreshToken, AuthController.refreshToken);

// Định tuyến API Logout (Yêu cầu phải có Access Token)
router.post('/logout', authMiddleware, authValidator.validateLogout, AuthController.logout);

export default router;
