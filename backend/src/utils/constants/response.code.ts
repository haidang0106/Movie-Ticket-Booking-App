export type ResponseCodeType = {
  code: number;
  message: string;
};

/**
 * Tập hợp danh sách các Business Response Code (Thành công)
 */
export const ResponseCode = {
  SUCCESS: { code: 1000, message: 'Success' },
  NO_DATA_FOUND: { code: 1005, message: 'No data found' },
  USER_CREATED: { code: 1100, message: 'User created successfully' },
  LOGIN_SUCCESS: { code: 2000, message: 'Login success' }
} as const;

export type ResponseCodeKeys = keyof typeof ResponseCode;
