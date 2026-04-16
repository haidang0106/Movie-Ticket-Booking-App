import { Request, Response, NextFunction } from 'express';

type AsyncExpressMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Hàm bao bọc (Wrapper) bắt buộc dùng cho toàn bộ Controller có chứa Async/Await.
 * Giúp ngăn tình trạng sập Server do (UnhandledPromiseRejection) nếu Database lỗi.
 * Thay vì văng lỗi văng vãi, nó sẽ tự động ném (catch) về global.exception.handler.ts.
 */
export const asyncHandler = (fn: AsyncExpressMiddleware) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
