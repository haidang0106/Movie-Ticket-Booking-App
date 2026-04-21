import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

/**
 * Auth Routes (TV1 responsibility - Setup by TV5 for Admin Login)
 * Prefix: /api/auth
 */

router.post('/login', AuthController.login);

export default router;
