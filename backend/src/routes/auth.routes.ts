import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authValidator } from '../validators/auth.validator';

const router = Router();

// Định tuyến API Đăng ký yêu cầu cấp OTP
router.post('/register', authValidator.validateRegister, AuthController.register);

// Định tuyến API Xác nhận OTP để tạo tài khoản thật sự
router.post('/verify-otp', AuthController.verifyOtp);

// Định tuyến API Đăng nhập tài khoản (cơ bản)
router.post('/login', authValidator.validateLogin, AuthController.login);

export default router;
