export type ErrorCodeType = {
  code: number;
  message: string;
  statusCode: number; // Dành riêng cho Express để định tuyến HTTP Status Code
};

/**
 * Tập hợp danh sách các Business Error Code (Thất bại)
 */
export const ErrorCode = {
  UNCATEGORIZED_EXCEPTION: { code: 9999, message: 'Uncategorized error', statusCode: 500 },
  USER_NOT_EXISTED: { code: 1000, message: 'User not existed', statusCode: 404 },
  USER_EXISTED: { code: 1001, message: 'User existed', statusCode: 400 },
  UNAUTHENTICATED: { code: 3000, message: 'Unauthenticated', statusCode: 401 },
} as const;

export type ErrorCodeKeys = keyof typeof ErrorCode;
