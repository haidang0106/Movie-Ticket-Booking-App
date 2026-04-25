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
    
    // Gửi OTP qua email thay vì tạo ngay
    const result = await AuthService.registerWithOtp(email, password);

    const responseBody = ApiResponse.success(ResponseCode.OTP_SENT, result);
    
    res.status(200).json(responseBody);
  });

  /**
   * Xử lý luồng xác thực OTP:
   * Trích xuất email & otp, gọi Service để đối chiếu Cache và ghi DB.
   */
  static verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    
    const result = await AuthService.verifyOtp(email, otp);

    const responseBody = ApiResponse.success(ResponseCode.USER_CREATED, result);
    
    res.status(201).json(responseBody);
  });

  /**
   * Xử lý luồng đăng nhập cơ bản:
   * Trích xuất req.body, gọi Service và trả về Access Token.
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.loginBasic(email, password);

    const responseBody = ApiResponse.success(ResponseCode.LOGIN_SUCCESS, result);

    res.status(200).json(responseBody);
  });
}
