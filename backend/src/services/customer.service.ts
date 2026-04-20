import { CustomerModel, UpdateCustomerPayload } from '../models/customer.model';
import { AppException } from '../utils/exceptions/app.exception';
import { ErrorCode } from '../utils/exceptions/error.code';

export class CustomerService {
  /**
   * Truy xuất thông tin Profile cá nhân dựa trên AccountID của phiên đăng nhập hiện tại
   */
  static async getProfile(accountId: number) {
    const profile = await CustomerModel.findByAccountId(accountId);
    
    // Đề phòng trường hợp database lỗi sinh ra Account nhưng chưa sinh Customer record
    if (!profile) {
      throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }
    
    return profile;
  }

  /**
   * Cập nhật thông tin Profile cá nhân.
   * Lớp service xử lý để có thể kiểm tra lỗi nếu tài khoản không tồn tại.
   */
  static async updateProfile(accountId: number, data: UpdateCustomerPayload) {
    const updatedProfile = await CustomerModel.updateProfileByAccountId(accountId, data);
    
    if (!updatedProfile) {
      throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }
    
    return updatedProfile;
  }
}
