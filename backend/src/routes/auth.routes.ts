import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Định tuyến API Đăng ký tài khoản (cơ bản)
router.post('/register', AuthController.register);

export default router;
