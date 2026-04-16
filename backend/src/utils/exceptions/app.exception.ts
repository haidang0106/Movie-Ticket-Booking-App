import { ErrorCodeType } from './error.code';

/**
 * Custom Error Exception: Ném lỗi này ở bất kỳ đâu trong mô hình MVC/Service Layer.
 * GlobalExceptionHandler sẽ chụp tự động.
 */
export class AppException extends Error {
  public readonly errorCode: ErrorCodeType;

  constructor(errorCode: ErrorCodeType) {
    super(errorCode.message);
    // Đảm bảo prototype chain trong TypeScript bắt chuẩn xác class kế thừa Error
    Object.setPrototypeOf(this, new.target.prototype);
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
