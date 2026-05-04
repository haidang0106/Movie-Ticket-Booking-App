import { getPool } from '../config/database';
import sql from 'mssql';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    const pool = getPool();
    
    // Kiểm tra xem đã có admin chưa
    const checkResult = await pool.request()
      .query("SELECT * FROM [dbo].[Account] WHERE Email = 'admin@cine.com'");
      
    if (checkResult.recordset.length > 0) {
      console.log('Tài khoản admin đã tồn tại. Skipper.');
      return;
    }

    // Hash password '123456'
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Chèn tài khoản admin
    await pool.request()
      .input('email', sql.NVarChar(100), 'admin@cine.com')
      .input('password', sql.NVarChar(255), hashedPassword)
      .input('role', sql.NVarChar(20), 'ADMIN')
      .query(`
        INSERT INTO [dbo].[Account] 
        (Email, PasswordHash, AccountType, IsActive, IsVerified, CreatedAt)
        VALUES (@email, @password, @role, 1, 1, GETDATE())
      `);

    console.log('✅ Đã tạo tài khoản admin thành công (admin / 123456)');
  } catch (error) {
    console.error('Lỗi khi seed thư mục admin:', error);
  }
}

// Hàm này có thể được gọi tại lúc khởi động server nếu cần
export { seedAdmin };
