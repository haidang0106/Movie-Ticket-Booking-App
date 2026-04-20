const { mssql } = require('../config/db');

class CinemaModel {
  /**
   * Lấy danh sách cụm rạp có phân trang và bộ lọc
   */
  static async findAll({ offset = 0, limit = 20, filters = {} }) {
    const pool = await mssql.connect();
    
    // Tạo request riêng cho count và data
    const countRequest = pool.request();
    const dataRequest = pool.request();
    
    let whereConditions = [];
    
    if (filters.cityId) {
      whereConditions.push('c.CityID = @cityId');
      countRequest.input('cityId', mssql.Int, filters.cityId);
      dataRequest.input('cityId', mssql.Int, filters.cityId);
    }
    
    if (filters.isActive !== undefined) {
      whereConditions.push('c.IsActive = @isActive');
      const isActiveVal = filters.isActive ? 1 : 0;
      countRequest.input('isActive', mssql.Bit, isActiveVal);
      dataRequest.input('isActive', mssql.Bit, isActiveVal);
    }
    
    const whereSQL = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    // Đếm tổng số bản ghi
    const countResult = await countRequest.query(`
      SELECT COUNT(*) AS total 
      FROM Cinema c
      ${whereSQL}
    `);
    
    const total = countResult.recordset[0].total;
    
    // Lấy dữ liệu phân trang (kèm tên thành phố)
    dataRequest.input('offset', mssql.Int, offset);
    dataRequest.input('limit', mssql.Int, limit);
    
    const result = await dataRequest.query(`
      SELECT c.*, ci.CityName 
      FROM Cinema c
      LEFT JOIN City ci ON c.CityID = ci.CityID
      ${whereSQL}
      ORDER BY c.CinemaID DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);
    
    return {
      cinemas: result.recordset,
      total
    };
  }
  
  /**
   * Lấy chi tiết cụm rạp theo ID (kèm tên thành phố)
   */
  static async findById(id) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query(`
        SELECT c.*, ci.CityName 
        FROM Cinema c
        LEFT JOIN City ci ON c.CityID = ci.CityID
        WHERE c.CinemaID = @id
      `);
    return result.recordset[0] || null;
  }
  
  /**
   * Thêm cụm rạp mới
   */
  static async create(cinemaData) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('name', mssql.NVarChar, cinemaData.name)
      .input('address', mssql.NVarChar, cinemaData.address || null)
      .input('district', mssql.NVarChar, cinemaData.district || null)
      .input('cityId', mssql.Int, cinemaData.cityId)
      .input('latitude', mssql.Decimal(9, 6), cinemaData.latitude || null)
      .input('longitude', mssql.Decimal(9, 6), cinemaData.longitude || null)
      .input('isActive', mssql.Bit, cinemaData.isActive !== undefined ? cinemaData.isActive : 1)
      .query(`
        INSERT INTO Cinema (
          CinemaName, Address, District, CityID, Latitude, Longitude, IsActive
        ) 
        OUTPUT INSERTED.*
        VALUES (
          @name, @address, @district, @cityId, @latitude, @longitude, @isActive
        )
      `);
    return result.recordset[0];
  }
  
  /**
   * Cập nhật thông tin cụm rạp
   */
  static async update(id, cinemaData) {
    const pool = await mssql.connect();
    await pool.request()
      .input('id', mssql.Int, id)
      .input('name', mssql.NVarChar, cinemaData.name)
      .input('address', mssql.NVarChar, cinemaData.address || null)
      .input('district', mssql.NVarChar, cinemaData.district || null)
      .input('cityId', mssql.Int, cinemaData.cityId)
      .input('latitude', mssql.Decimal(9, 6), cinemaData.latitude || null)
      .input('longitude', mssql.Decimal(9, 6), cinemaData.longitude || null)
      .input('isActive', mssql.Bit, cinemaData.isActive !== undefined ? cinemaData.isActive : 1)
      .query(`
        UPDATE Cinema SET
          CinemaName = @name,
          Address = @address,
          District = @district,
          CityID = @cityId,
          Latitude = @latitude,
          Longitude = @longitude,
          IsActive = @isActive
        WHERE CinemaID = @id
      `);
    return { ...cinemaData, CinemaID: id };
  }
  
  /**
   * Xóa mềm cụm rạp (set IsActive = 0)
   */
  static async delete(id) {
    const pool = await mssql.connect();
    await pool.request()
      .input('id', mssql.Int, id)
      .query('UPDATE Cinema SET IsActive = 0 WHERE CinemaID = @id');
    return { CinemaID: id };
  }
  
  /**
   * Kiểm tra cụm rạp có tồn tại và đang hoạt động không
   */
  static async checkCinemaExists(id) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query('SELECT COUNT(*) AS count FROM Cinema WHERE CinemaID = @id AND IsActive = 1');
    return result.recordset[0].count > 0;
  }
}

module.exports = CinemaModel;