import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Định tuyến API Đăng ký tài khoản (cơ bản)
router.post('/register', AuthController.register);

// Định tuyến API Đăng nhập tài khoản (cơ bản)
router.post('/login', AuthController.login);

export default router;
