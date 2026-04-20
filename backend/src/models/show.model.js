const { mssql } = require('../config/db');

class ShowModel {
  /**
   * Lấy danh sách suất chiếu có phân trang và bộ lọc
   */
  static async findAll({ offset = 0, limit = 20, filters = {} }) {
    const pool = await mssql.connect();
    
    const countRequest = pool.request();
    const dataRequest = pool.request();
    
    let whereConditions = [];
    
    if (filters.movieId) {
      whereConditions.push('s.MovieID = @movieId');
      countRequest.input('movieId', mssql.Int, filters.movieId);
      dataRequest.input('movieId', mssql.Int, filters.movieId);
    }
    
    if (filters.cinemaId) {
      whereConditions.push('ci.CinemaID = @cinemaId');
      countRequest.input('cinemaId', mssql.Int, filters.cinemaId);
      dataRequest.input('cinemaId', mssql.Int, filters.cinemaId);
    }
    
    if (filters.date) {
      whereConditions.push('s.ShowDate = @date');
      countRequest.input('date', mssql.Date, filters.date);
      dataRequest.input('date', mssql.Date, filters.date);
    }
    
    if (filters.format) {
      whereConditions.push('s.Format = @format');
      countRequest.input('format', mssql.NVarChar, filters.format);
      dataRequest.input('format', mssql.NVarChar, filters.format);
    }
    
    const whereSQL = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    // Đếm tổng số bản ghi
    const countResult = await countRequest.query(`
      SELECT COUNT(*) AS total 
      FROM [Show] s
      INNER JOIN CinemaHall h ON s.HallID = h.HallID
      INNER JOIN Cinema ci ON h.CinemaID = ci.CinemaID
      ${whereSQL}
    `);
    
    const total = countResult.recordset[0].total;
    
    // Lấy dữ liệu phân trang (kèm thông tin phim, phòng chiếu, cụm rạp)
    dataRequest.input('offset', mssql.Int, offset);
    dataRequest.input('limit', mssql.Int, limit);
    
    const result = await dataRequest.query(`
      SELECT s.*, m.MovieTitle, m.MovieGenre, m.MovieLanguage, m.MovieRuntime,
             m.MovieReleaseDate, m.Rating,
             h.HallName, h.TotalRows, h.TotalCols, h.TotalSeats,
             ci.CinemaName, ci.Address, ci.District, ci.CityID,
             c.CityName
      FROM [Show] s
      INNER JOIN Movie m ON s.MovieID = m.MovieID
      INNER JOIN CinemaHall h ON s.HallID = h.HallID
      INNER JOIN Cinema ci ON h.CinemaID = ci.CinemaID
      INNER JOIN City c ON ci.CityID = c.CityID
      ${whereSQL}
      ORDER BY s.ShowDate DESC, s.ShowTime DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);
    
    return {
      shows: result.recordset,
      total
    };
  }

  /**
   * Lấy chi tiết suất chiếu theo ID (kèm phim, phòng, rạp, thành phố)
   */
  static async findById(id) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query(`
        SELECT s.*, m.MovieTitle, m.MovieGenre, m.MovieLanguage, m.MovieRuntime, 
               m.MovieReleaseDate, m.MovieActor, m.MovieDirector, m.MovieDescription, 
               m.TrailerUrl, m.Rating, m.IsFeatured, m.FeaturedOrder,
               h.HallName, h.TotalRows, h.TotalCols, h.TotalSeats,
               ci.CinemaName, ci.Address, ci.District, ci.CityID,
               c.CityName
        FROM [Show] s
        INNER JOIN Movie m ON s.MovieID = m.MovieID
        INNER JOIN CinemaHall h ON s.HallID = h.HallID
        INNER JOIN Cinema ci ON h.CinemaID = ci.CinemaID
        INNER JOIN City c ON ci.CityID = c.CityID
        WHERE s.ShowID = @id
      `);
    return result.recordset[0] || null;
  }
  
  /**
   * Lấy suất chiếu theo cụm rạp và ngày
   */
  static async findByCinemaAndDate(cinemaId, date) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('cinemaId', mssql.Int, cinemaId)
      .input('date', mssql.Date, date)
      .query(`
        SELECT s.*, m.MovieTitle, m.MovieGenre, m.MovieLanguage, m.MovieRuntime, 
               m.MovieReleaseDate, m.MovieActor, m.MovieDirector, m.MovieDescription, 
               m.TrailerUrl, m.Rating, m.IsFeatured, m.FeaturedOrder,
               h.HallName, h.TotalRows, h.TotalCols, h.TotalSeats
        FROM [Show] s
        INNER JOIN Movie m ON s.MovieID = m.MovieID
        INNER JOIN CinemaHall h ON s.HallID = h.HallID
        WHERE h.CinemaID = @cinemaId 
          AND s.ShowDate = @date
          AND m.IsActive = 1
        ORDER BY s.ShowTime
      `);
    return result.recordset;
  }
  
  /**
   * Lấy suất chiếu sắp tới theo phim (chỉ lấy từ hôm nay trở đi)
   */
  static async findByMovie(movieId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('movieId', mssql.Int, movieId)
      .query(`
        SELECT s.*, h.HallName, h.TotalRows, h.TotalCols, h.TotalSeats,
               ci.CinemaName, ci.Address, ci.District, ci.CityID,
               c.CityName
        FROM [Show] s
        INNER JOIN CinemaHall h ON s.HallID = h.HallID
        INNER JOIN Cinema ci ON h.CinemaID = ci.CinemaID
        INNER JOIN City c ON ci.CityID = c.CityID
        INNER JOIN Movie m ON s.MovieID = m.MovieID
        WHERE s.MovieID = @movieId
          AND s.ShowDate >= CAST(GETDATE() AS DATE)
          AND m.IsActive = 1
        ORDER BY s.ShowDate, s.ShowTime
      `);
    return result.recordset;
  }
  
  /**
   * Tạo suất chiếu mới
   */
  static async create(showData) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('movieId', mssql.Int, showData.movieId)
      .input('hallId', mssql.Int, showData.hallId)
      .input('showDate', mssql.Date, showData.showDate)
      .input('showTime', mssql.Time, showData.showTime)
      .input('endTime', mssql.Time, showData.endTime)
      .input('format', mssql.NVarChar, showData.format)
      .input('basePrice', mssql.Decimal(10, 2), showData.basePrice)
      .query(`
        INSERT INTO [Show] (
          MovieID, HallID, ShowDate, ShowTime, EndTime, Format, BasePrice
        ) 
        OUTPUT INSERTED.*
        VALUES (
          @movieId, @hallId, @showDate, @showTime, @endTime, @format, @basePrice
        )
      `);
    return result.recordset[0];
  }
  
  /**
   * Cập nhật suất chiếu
   */
  static async update(id, showData) {
    const pool = await mssql.connect();
    await pool.request()
      .input('id', mssql.Int, id)
      .input('movieId', mssql.Int, showData.movieId)
      .input('hallId', mssql.Int, showData.hallId)
      .input('showDate', mssql.Date, showData.showDate)
      .input('showTime', mssql.Time, showData.showTime)
      .input('endTime', mssql.Time, showData.endTime)
      .input('format', mssql.NVarChar, showData.format)
      .input('basePrice', mssql.Decimal(10, 2), showData.basePrice)
      .query(`
        UPDATE [Show] SET
          MovieID = @movieId,
          HallID = @hallId,
          ShowDate = @showDate,
          ShowTime = @showTime,
          EndTime = @endTime,
          Format = @format,
          BasePrice = @basePrice
        WHERE ShowID = @id
      `);
    return { ...showData, ShowID: id };
  }
  
  /**
   * Xóa suất chiếu
   */
  static async delete(id) {
    const pool = await mssql.connect();
    await pool.request()
      .input('id', mssql.Int, id)
      .query('DELETE FROM [Show] WHERE ShowID = @id');
    return { ShowID: id };
  }
  
  /**
   * Kiểm tra xung đột lịch chiếu (cùng phòng, thời gian trùng)
   */
  static async checkConflict(hallId, showDate, showTime, endTime, excludeShowId = null) {
    const pool = await mssql.connect();
    
    let query = `
      SELECT COUNT(*) AS count 
      FROM [Show] 
      WHERE HallID = @hallId 
        AND ShowDate = @showDate
        AND (
          (ShowTime < @endTime AND EndTime > @showTime)
        )
    `;
    
    const request = pool.request()
      .input('hallId', mssql.Int, hallId)
      .input('showDate', mssql.Date, showDate)
      .input('showTime', mssql.Time, showTime)
      .input('endTime', mssql.Time, endTime);
    
    if (excludeShowId) {
      query += ' AND ShowID != @excludeShowId';
      request.input('excludeShowId', mssql.Int, excludeShowId);
    }
    
    const result = await request.query(query);
    return result.recordset[0].count > 0;
  }
  
  /**
   * Lấy danh sách suất chiếu sắp tới của phim
   */
  static async getUpcomingShows(movieId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('movieId', mssql.Int, movieId)
      .query(`
        SELECT s.*, h.HallName, h.TotalRows, h.TotalCols, h.TotalSeats,
               ci.CinemaName, ci.Address, ci.District, ci.CityID,
               c.CityName
        FROM [Show] s
        INNER JOIN CinemaHall h ON s.HallID = h.HallID
        INNER JOIN Cinema ci ON h.CinemaID = ci.CinemaID
        INNER JOIN City c ON ci.CityID = c.CityID
        INNER JOIN Movie m ON s.MovieID = m.MovieID
        WHERE s.MovieID = @movieId
          AND s.ShowDate >= CAST(GETDATE() AS DATE)
          AND m.IsActive = 1
        ORDER BY s.ShowDate, s.ShowTime
      `);
    return result.recordset;
  }

  /**
   * Lấy sơ đồ ghế cho suất chiếu cụ thể
   */
  static async getShowSeats(showId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('showId', mssql.Int, showId)
      .query(`
        SELECT s.ShowID, s.HallID, 
               chs.SeatID, chs.SeatNumber, chs.SeatType, chs.SeatPrice,
               chs.PairID, chs.RowIndex, chs.ColIndex, chs.IsAisle
        FROM [Show] s
        INNER JOIN CinemaHallSeat chs ON s.HallID = chs.HallID
        WHERE s.ShowID = @showId
        ORDER BY chs.RowIndex, chs.ColIndex
      `);
    return result.recordset;
  }
}

module.exports = ShowModel;