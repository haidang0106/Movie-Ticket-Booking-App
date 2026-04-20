const { mssql } = require('../config/db');

class SeatModel {
  /**
   * Lấy danh sách ghế theo phòng chiếu
   */
  static async findByHall(hallId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('hallId', mssql.Int, hallId)
      .query('SELECT * FROM CinemaHallSeat WHERE HallID = @hallId ORDER BY RowIndex, ColIndex');
    return result.recordset;
  }
  
  /**
   * Lấy chi tiết ghế theo ID
   */
  static async findById(id) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query('SELECT * FROM CinemaHallSeat WHERE SeatID = @id');
    return result.recordset[0] || null;
  }
  
  /**
   * Thêm ghế mới
   */
  static async create(seatData) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('hallId', mssql.Int, seatData.hallId)
      .input('seatNumber', mssql.NVarChar, seatData.seatNumber)
      .input('seatType', mssql.NVarChar, seatData.seatType)
      .input('seatPrice', mssql.Decimal(10, 2), seatData.seatPrice || 0)
      .input('pairId', mssql.Int, seatData.pairId || null)
      .input('rowIndex', mssql.Int, seatData.rowIndex)
      .input('colIndex', mssql.Int, seatData.colIndex)
      .input('isAisle', mssql.Bit, seatData.isAisle ? 1 : 0)
      .query(`
        INSERT INTO CinemaHallSeat (
          HallID, SeatNumber, SeatType, SeatPrice, PairID, 
          RowIndex, ColIndex, IsAisle
        ) 
        OUTPUT INSERTED.*
        VALUES (
          @hallId, @seatNumber, @seatType, @seatPrice, @pairId,
          @rowIndex, @colIndex, @isAisle
        )
      `);
    return result.recordset[0];
  }
  
  /**
   * Thêm nhiều ghế cùng lúc (batch insert)
   */
  static async createMany(seatsData) {
    const pool = await mssql.connect();
    const request = pool.request();
    
    // Thêm tham số cho từng ghế
    seatsData.forEach((seat, index) => {
      request.input(`hallId_${index}`, mssql.Int, seat.hallId);
      request.input(`seatNumber_${index}`, mssql.NVarChar, seat.seatNumber);
      request.input(`seatType_${index}`, mssql.NVarChar, seat.seatType);
      request.input(`seatPrice_${index}`, mssql.Decimal(10, 2), seat.seatPrice || 0);
      request.input(`pairId_${index}`, mssql.Int, seat.pairId || null);
      request.input(`rowIndex_${index}`, mssql.Int, seat.rowIndex);
      request.input(`colIndex_${index}`, mssql.Int, seat.colIndex);
      request.input(`isAisle_${index}`, mssql.Bit, seat.isAisle ? 1 : 0);
    });
    
    // Tạo mệnh đề VALUES
    const valuesClause = seatsData.map((_, index) => 
      `(@hallId_${index}, @seatNumber_${index}, @seatType_${index}, @seatPrice_${index}, @pairId_${index}, @rowIndex_${index}, @colIndex_${index}, @isAisle_${index})`
    ).join(', ');
    
    const result = await request.query(`
      INSERT INTO CinemaHallSeat (
        HallID, SeatNumber, SeatType, SeatPrice, PairID, 
        RowIndex, ColIndex, IsAisle
      ) 
      OUTPUT INSERTED.*
      VALUES ${valuesClause}
    `);
    
    return result.recordset;
  }
  
  /**
   * Cập nhật thông tin ghế
   */
  static async update(id, seatData) {
    const pool = await mssql.connect();
    await pool.request()
      .input('id', mssql.Int, id)
      .input('seatNumber', mssql.NVarChar, seatData.seatNumber)
      .input('seatType', mssql.NVarChar, seatData.seatType)
      .input('seatPrice', mssql.Decimal(10, 2), seatData.seatPrice || 0)
      .input('pairId', mssql.Int, seatData.pairId || null)
      .input('rowIndex', mssql.Int, seatData.rowIndex)
      .input('colIndex', mssql.Int, seatData.colIndex)
      .input('isAisle', mssql.Bit, seatData.isAisle ? 1 : 0)
      .query(`
        UPDATE CinemaHallSeat SET
          SeatNumber = @seatNumber,
          SeatType = @seatType,
          SeatPrice = @seatPrice,
          PairID = @pairId,
          RowIndex = @rowIndex,
          ColIndex = @colIndex,
          IsAisle = @isAisle
        WHERE SeatID = @id
      `);
    return { ...seatData, SeatID: id };
  }
  
  /**
   * Xóa ghế theo ID
   */
  static async delete(id) {
    const pool = await mssql.connect();
    await pool.request()
      .input('id', mssql.Int, id)
      .query('DELETE FROM CinemaHallSeat WHERE SeatID = @id');
    return { SeatID: id };
  }
  
  /**
   * Xóa tất cả ghế của một phòng chiếu
   */
  static async deleteByHall(hallId) {
    const pool = await mssql.connect();
    await pool.request()
      .input('hallId', mssql.Int, hallId)
      .query('DELETE FROM CinemaHallSeat WHERE HallID = @hallId');
    return { hallId };
  }
  
  /**
   * Kiểm tra phòng chiếu có tồn tại không
   */
  static async checkHallExists(hallId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('hallId', mssql.Int, hallId)
      .query('SELECT COUNT(*) AS count FROM CinemaHall WHERE HallID = @hallId');
    return result.recordset[0].count > 0;
  }
}

module.exports = SeatModel;