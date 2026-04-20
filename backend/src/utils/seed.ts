import { getPool } from '../config/database';
import sql from 'mssql';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  try {
    const pool = getPool();
    
    // Kiểm tra xem đã có admin chưa
    const checkResult = await pool.request()
      .query("SELECT * FROM [dbo].[Account] WHERE AccountName = 'admin'");
      
    if (checkResult.recordset.length > 0) {
      console.log('Tài khoản admin đã tồn tại. Skipper.');
      return;
    }

    // Hash password '123456'
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Chèn tài khoản admin
    await pool.request()
      .input('username', sql.NVarChar(100), 'admin')
      .input('password', sql.NVarChar(255), hashedPassword)
      .input('role', sql.NVarChar(20), 'ADMIN')
      .query(`
        INSERT INTO [dbo].[Account] 
        (AccountName, AccountPassword, AccountType, IsActive, IsVerified, CreatedAt)
        VALUES (@username, @password, @role, 1, 1, GETDATE())
      `);

    console.log('✅ Đã tạo tài khoản admin thành công (admin / 123456)');
  } catch (error) {
    console.error('Lỗi khi seed thư mục admin:', error);
  }
}

// Hàm này có thể được gọi tại lúc khởi động server nếu cần
export { seedAdmin };
