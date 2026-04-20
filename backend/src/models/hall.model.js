const { mssql } = require('../config/db');

class HallModel {
  /**
   * Lấy danh sách phòng chiếu theo cụm rạp
   */
  static async findByCinema(cinemaId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('cinemaId', mssql.Int, cinemaId)
      .query('SELECT * FROM CinemaHall WHERE CinemaID = @cinemaId ORDER BY HallID');
    return result.recordset;
  }
  
  /**
   * Lấy chi tiết phòng chiếu theo ID
   */
  static async findById(id) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query('SELECT * FROM CinemaHall WHERE HallID = @id');
    return result.recordset[0] || null;
  }
  
  /**
   * Thêm phòng chiếu mới
   */
  static async create(hallData) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('cinemaId', mssql.Int, hallData.cinemaId)
      .input('name', mssql.NVarChar, hallData.name)
      .input('totalRows', mssql.Int, hallData.totalRows)
      .input('totalCols', mssql.Int, hallData.totalCols)
      .input('totalSeats', mssql.Int, hallData.totalSeats || (hallData.totalRows * hallData.totalCols))
      .query(`
        INSERT INTO CinemaHall (
          CinemaID, HallName, TotalRows, TotalCols, TotalSeats
        ) 
        OUTPUT INSERTED.*
        VALUES (
          @cinemaId, @name, @totalRows, @totalCols, @totalSeats
        )
      `);
    return result.recordset[0];
  }
  
  /**
   * Thêm nhiều phòng chiếu cùng lúc (batch insert)
   */
  static async createMany(hallsData) {
    const pool = await mssql.connect();
    const request = pool.request();
    
    // Thêm tham số cho từng phòng chiếu
    hallsData.forEach((hall, index) => {
      request.input(`cinemaId_${index}`, mssql.Int, hall.cinemaId);
      request.input(`name_${index}`, mssql.NVarChar, hall.name);
      request.input(`totalRows_${index}`, mssql.Int, hall.totalRows);
      request.input(`totalCols_${index}`, mssql.Int, hall.totalCols);
      request.input(`totalSeats_${index}`, mssql.Int, hall.totalSeats || (hall.totalRows * hall.totalCols));
    });
    
    // Tạo mệnh đề VALUES
    const valuesClause = hallsData.map((_, index) => 
      `(@cinemaId_${index}, @name_${index}, @totalRows_${index}, @totalCols_${index}, @totalSeats_${index})`
    ).join(', ');
    
    const result = await request.query(`
      INSERT INTO CinemaHall (
        CinemaID, HallName, TotalRows, TotalCols, TotalSeats
      ) 
      OUTPUT INSERTED.*
      VALUES ${valuesClause}
    `);
    
    return result.recordset;
  }
  
  /**
   * Cập nhật thông tin phòng chiếu
   */
  static async update(id, hallData) {
    const pool = await mssql.connect();
    await pool.request()
      .input('id', mssql.Int, id)
      .input('name', mssql.NVarChar, hallData.name)
      .input('totalRows', mssql.Int, hallData.totalRows)
      .input('totalCols', mssql.Int, hallData.totalCols)
      .input('totalSeats', mssql.Int, hallData.totalSeats || (hallData.totalRows * hallData.totalCols))
      .query(`
        UPDATE CinemaHall SET
          HallName = @name,
          TotalRows = @totalRows,
          TotalCols = @totalCols,
          TotalSeats = @totalSeats
        WHERE HallID = @id
      `);
    return { ...hallData, HallID: id };
  }
  
  /**
   * Xóa phòng chiếu
   */
  static async delete(id) {
    const pool = await mssql.connect();
    await pool.request()
      .input('id', mssql.Int, id)
      .query('DELETE FROM CinemaHall WHERE HallID = @id');
    return { HallID: id };
  }
  
  /**
   * Xóa tất cả phòng chiếu của một cụm rạp
   */
  static async deleteByCinema(cinemaId) {
    const pool = await mssql.connect();
    await pool.request()
      .input('cinemaId', mssql.Int, cinemaId)
      .query('DELETE FROM CinemaHall WHERE CinemaID = @cinemaId');
    return { cinemaId };
  }
  
  /**
   * Kiểm tra phòng chiếu có tồn tại không
   */
  static async checkHallExists(id) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query('SELECT COUNT(*) AS count FROM CinemaHall WHERE HallID = @id');
    return result.recordset[0].count > 0;
  }
  
  /**
   * Kiểm tra cụm rạp có tồn tại và đang hoạt động không
   */
  static async checkCinemaExists(cinemaId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('cinemaId', mssql.Int, cinemaId)
      .query('SELECT COUNT(*) AS count FROM Cinema WHERE CinemaID = @cinemaId AND IsActive = 1');
    return result.recordset[0].count > 0;
  }
  
  /**
   * Cập nhật tổng số ghế của phòng chiếu
   */
  static async updateTotalSeats(hallId, totalSeats) {
    const pool = await mssql.connect();
    await pool.request()
      .input('hallId', mssql.Int, hallId)
      .input('totalSeats', mssql.Int, totalSeats)
      .query('UPDATE CinemaHall SET TotalSeats = @totalSeats WHERE HallID = @hallId');
    return { HallID: hallId, TotalSeats: totalSeats };
  }

  /**
   * Lấy sơ đồ ghế của phòng chiếu
   */
  static async findSeatsByHallId(hallId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('hallId', mssql.Int, hallId)
      .query('SELECT * FROM CinemaHallSeat WHERE HallID = @hallId ORDER BY RowIndex, ColIndex');
    return result.recordset;
  }
}

module.exports = HallModel;