import sql from 'mssql';
import { getPool } from '../config/database';

export class CustomerModel {
  /**
   * Tạo bản ghi Customer căn bản liên kết với AccountID.
   * Thường được gọi ngay sau khi tạo Account dành cho user mới (Register).
   */
  static async create(accountId: number) {
    const pool = getPool();
    const result = await pool.request()
      .input('AccountID', sql.Int, accountId)
      .query(`
        INSERT INTO Customer (AccountID, LoyaltyPoints)
        OUTPUT INSERTED.CustomerID, INSERTED.AccountID
        VALUES (@AccountID, 0)
      `);
      
    return result.recordset[0];
  }
}
