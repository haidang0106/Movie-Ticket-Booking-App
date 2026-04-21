import { ResponseCode, ResponseCodeType } from '../constants/response.code';
import { ErrorCodeType } from '../exceptions/error.code';

/**
 * Wrapper Class thống nhất mọi Response trả về từ Server 
 */
export class ApiResponse<T> {
  public code: number;
  public message: string;
  public data?: T;
  public timestamp: string;

  private constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
    this.timestamp = new Date().toISOString();
  }

  /**
   * Khởi tạo Response thành công
   */
  public static success<T>(responseCode: ResponseCodeType, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(responseCode.code, responseCode.message, data);
  }

  /**
   * Khởi tạo Response lỗi
   */
  public static error<T = null>(errorCode: ErrorCodeType): ApiResponse<T> {
    return new ApiResponse<T>(errorCode.code, errorCode.message);
  }

  /**
   * Tự động bắt logic danh sách: Nếu array trống -> trả về NO_DATA_FOUND
   */
  public static ofList<T>(responseCode: ResponseCodeType, data: T[]): ApiResponse<T[]> {
    if (!data || data.length === 0) {
      return new ApiResponse<T[]>(ResponseCode.NO_DATA_FOUND.code, ResponseCode.NO_DATA_FOUND.message, []);
    }
    return new ApiResponse<T[]>(responseCode.code, responseCode.message, data);
  }
}
