import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cấu hình khởi tạo và kết nối Redis Client sử dụng thư viện ioredis.
 * Đóng vai trò là In-Memory lưu trữ mã OTP, Blacklist JWT Token siêu tốc.
 */
const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  // lazyConnect = true để Redis không chặn ứng dụng nếu server dev chưa bật Redis
  lazyConnect: true,
});

redisClient.on('connect', () => {
  console.log('[📦 Redis]   Kết nối thành công (Ready)');
});

redisClient.on('error', (err) => {
  console.error('[❌ Redis]   Lỗi kết nối:', err.message);
});

export default redisClient;
