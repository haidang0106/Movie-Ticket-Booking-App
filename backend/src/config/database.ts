import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config();

/**
 * Cấu hình kết nối SQL Server — theo AGENTS.md
 * Các thành viên KHÔNG được hardcode thông tin DB.
 * Toàn bộ giá trị lấy từ file .env (xem .env.example).
 */
const dbConfig: sql.config = {
  server: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'MovieTicketDB',
  options: {
    encrypt: false,             // true nếu dùng Azure
    trustServerCertificate: true // dev local luôn để true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

/**
 * Singleton Pool — Toàn bộ backend dùng chung 1 connection pool duy nhất.
 * Import: import { getPool } from '../config/database';
 */
let pool: sql.ConnectionPool | null = null;

export const connectDB = async (): Promise<sql.ConnectionPool> => {
  try {
    if (!pool) {
      pool = await new sql.ConnectionPool(dbConfig).connect();
      console.log('[✅ Database] Kết nối SQL Server thành công!');
    }
    return pool;
  } catch (error) {
    console.error('[❌ Database] Kết nối SQL Server thất bại:', error);
    process.exit(1);
  }
};

export const getPool = (): sql.ConnectionPool => {
  if (!pool) {
    throw new Error('Database chưa được kết nối. Gọi connectDB() trước.');
  }
  return pool;
};
