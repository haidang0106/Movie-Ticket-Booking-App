import { getPool } from '../config/database';
import sql from 'mssql';

export class AuthModel {
  /**
   * Find an account by its unique AccountName
   */
  static async findByUsername(username: string) {
    const pool = getPool();
    const result = await pool.request()
      .input('username', sql.NVarChar(100), username)
      .query(`
        SELECT 
          AccountID, 
          AccountName, 
          AccountPassword, 
          AccountType, 
          IsActive 
        FROM [dbo].[Account] 
        WHERE AccountName = @username
      `);
    return result.recordset[0];
  }
}
