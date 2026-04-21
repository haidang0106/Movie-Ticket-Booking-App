import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthModel } from '../models/auth.model';

export class AuthController {
  
  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập tài khoản và mật khẩu' });
      }

      // 1. Tìm user trong DB
      const account = await AuthModel.findByUsername(username);

      if (!account) {
        return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại' });
      }

      // 2. Kiểm tra trạng thái kích hoạt
      if (!account.IsActive) {
        return res.status(403).json({ success: false, message: 'Tài khoản đã bị khóa' });
      }

      // 3. Kiểm tra mật khẩu (Sử dụng bcrypt để so sánh với mật khẩu đã băm trong DB)
      const isMatch = await bcrypt.compare(password, account.AccountPassword);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác' });
      }

      // 4. Tạo JWT Token
      const payload = {
        userId: account.AccountID,
        role: account.AccountType, 
        name: account.AccountName
      };

      const secret = process.env.JWT_SECRET || 'fallback_secret';
      const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

      const token = jwt.sign(payload, secret, { expiresIn: expiresIn as any });

      // 5. Trả về Frontend
      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          token,
          user: payload
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
}
