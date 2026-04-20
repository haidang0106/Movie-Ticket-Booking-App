import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/helpers/async.handler';
import { ApiResponse } from '../utils/dto/api.response';
import { ResponseCode } from '../utils/constants/response.code';

export class AuthController {
  /**
   * Xử lý luồng đăng ký cơ bản:
   * Trích xuất req.body, gọi Service và chuẩn hóa kết quả đầu ra bằng ApiResponse.
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    // AuthService.registerBasic sẽ tự động ném ra lỗi (AppException) nếu email trùng lặp.
    // Lỗi này thoát ra và bị bắt tại asyncHandler -> chuyển tới global.exception.handler.ts.
    const result = await AuthService.registerBasic(email, password);

    // Bọc kết quả thành công qua wrapper ApiResponse do repo quy định
    const responseBody = ApiResponse.success(ResponseCode.USER_CREATED, result);
    
    // HTTP Status Code 201 đại diện cho thao tác tạo mới Resource thành công.
    res.status(201).json(responseBody);
  });
}
