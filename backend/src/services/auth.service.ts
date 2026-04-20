import bcrypt from 'bcryptjs';
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
}
