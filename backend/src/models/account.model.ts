import sql from 'mssql';
import { getPool } from '../config/database';

export interface AccountPayload {
  Email: string;
  PasswordHash: string;
  AccountType: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

export class AccountModel {
  /**
   * Tìm kiếm tài khoản bằng Email phục vụ đăng nhập và kiểm tra trùng lặp
   */
  static async findByEmail(email: string) {
    const pool = getPool();
    const result = await pool.request()
      .input('Email', sql.NVarChar(100), email)
      .query(`
        SELECT AccountID, Email, PasswordHash, AccountType, IsActive, IsVerified 
        FROM Account 
        WHERE Email = @Email
      `);
    return result.recordset[0];
  }

  /**
   * Tạo tài khoản mới, trả về AccountID vừa tạo
   */
  static async create(data: AccountPayload) {
    const pool = getPool();
    const result = await pool.request()
      .input('Email', sql.NVarChar(100), data.Email)
      .input('PasswordHash', sql.NVarChar(255), data.PasswordHash)
      .input('AccountType', sql.NVarChar(50), data.AccountType)
      .query(`
        INSERT INTO Account (Email, PasswordHash, AccountType, IsActive, IsVerified)
        OUTPUT INSERTED.AccountID, INSERTED.Email, INSERTED.AccountType
        VALUES (@Email, @PasswordHash, @AccountType, 1, 0)
      `);
    
    return result.recordset[0];
  }
}
