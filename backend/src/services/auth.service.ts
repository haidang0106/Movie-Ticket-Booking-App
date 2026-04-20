import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { AccountModel, AccountPayload } from '../models/account.model';
import { CustomerModel } from '../models/customer.model';
import { AppException } from '../utils/exceptions/app.exception';
import { ErrorCode } from '../utils/exceptions/error.code';

export class AuthService {
  /**
   * Đăng ký cơ bản (Chưa yêu cầu OTP)
   * Phương án hiện tại: Gọi insert tuần tự (No-Transaction).
   * Do repo chưa nâng cấp context Transaction cho layer Model, ta dùng phương pháp tối giản nhất để giữ vi-bước.
   */
  static async registerBasic(email: string, passwordRaw: string) {
    // 1. Kiểm tra tài khoản tồn tại chưa
    const existing = await AccountModel.findByEmail(email);
    if (existing) {
      throw new AppException(ErrorCode.USER_EXISTED);
    }

    // 2. Hash password chuẩn bị tạo mới
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordRaw, salt);

    // 3. Chuẩn bị payload và tạo Account
    const accountPayload: AccountPayload = {
      Email: email,
      PasswordHash: passwordHash,
      AccountType: 'CUSTOMER'
    };
    const createdAccount = await AccountModel.create(accountPayload);

    // 4. Tạo Customer gắn liền với AccountID vừa được cấp
    const createdCustomer = await CustomerModel.create(createdAccount.AccountID);

    // 5. Trả về thông tin tối thiểu xác nhận đăng ký thành công
    return {
      accountId: createdAccount.AccountID,
      customerId: createdCustomer.CustomerID,
      email: createdAccount.Email,
    };
  }

  /**
   * Đăng nhập cơ bản (Chưa OTP)
   * Kiểm tra thông tin, hash và trả về JWT Access Token (Dữ liệu tối thiểu).
   */
  static async loginBasic(email: string, passwordRaw: string) {
    // 0. Chuẩn hóa email
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Kiểm tra tài khoản
    const account = await AccountModel.findByEmail(normalizedEmail);
    if (!account) {
      throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }

    // 2. Chặn tài khoản bị vô hiệu hóa
    if (!account.IsActive) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    // 3. Đối chiếu mật khẩu
    const isMatch = await bcrypt.compare(passwordRaw, account.PasswordHash);
    if (!isMatch) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    // 4. Khởi tạo Access Token (Payload cơ bản)
    const payload = {
      accountId: account.AccountID,
      accountType: account.AccountType,
    };
    
    // Đọc cấu hình từ biến môi trường
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    const expiresIn = (process.env.JWT_EXPIRES_IN as any) || '15m';

    const accessToken = jwt.sign(payload, secret, { expiresIn });

    // 5. Trả về thông tin tối thiểu
    return {
      accountId: account.AccountID,
      accountType: account.AccountType,
      accessToken
    };
  }
}
