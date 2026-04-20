const { mssql } = require('../config/db');

class LikeMovieModel {
  // Get like status for a movie by customer
  static async getLikeStatus(movieId, customerId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('movieId', mssql.Int, movieId)
      .input('customerId', mssql.Int, customerId)
      .query('SELECT IsLiked FROM LikeMovie WHERE MovieID = @movieId AND CustomerID = @customerId');
    
    return result.recordset.length > 0 ? result.recordset[0].IsLiked : false;
  }
  
  // Toggle like/unlike movie
  static async toggleLike(movieId, customerId) {
    const pool = await mssql.connect();
    
    // Check if already liked
    const existing = await pool.request()
      .input('movieId', mssql.Int, movieId)
      .input('customerId', mssql.Int, customerId)
      .query('SELECT * FROM LikeMovie WHERE MovieID = @movieId AND CustomerID = @customerId');
    
    if (existing.recordset.length > 0) {
      // Unlike
      await pool.request()
        .input('movieId', mssql.Int, movieId)
        .input('customerId', mssql.Int, customerId)
        .query('DELETE FROM LikeMovie WHERE MovieID = @movieId AND CustomerID = @customerId');
      return false;
    } else {
      // Like
      await pool.request()
        .input('movieId', mssql.Int, movieId)
        .input('customerId', mssql.Int, customerId)
        .query(`
          INSERT INTO LikeMovie (MovieID, CustomerID, IsLiked)
          VALUES (@movieId, @customerId, 1)
        `);
      return true;
    }
  }
  
  // Get number of likes for a movie
  static async getLikeCount(movieId) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('movieId', mssql.Int, movieId)
      .query('SELECT COUNT(*) AS count FROM LikeMovie WHERE MovieID = @movieId AND IsLiked = 1');
    return result.recordset[0].count;
  }
  
  // Get movies liked by a customer
  static async getLikedMoviesByCustomer(customerId, { page = 1, limit = 20 }) {
    const pool = await mssql.connect();
    const offset = (page - 1) * limit;
    
    // Count total records
    const countResult = await pool.request()
      .input('customerId', mssql.Int, customerId)
      .query(`
        SELECT COUNT(*) AS total 
        FROM LikeMovie lm
        INNER JOIN Movie m ON lm.MovieID = m.MovieID
        WHERE lm.CustomerID = @customerId
          AND lm.IsLiked = 1
          AND m.IsActive = 1
      `);
    
    const total = countResult.recordset[0].total;
    
    // Get paginated records
    const result = await pool.request()
      .input('customerId', mssql.Int, customerId)
      .input('offset', mssql.Int, offset)
      .input('limit', mssql.Int, limit)
      .query(`
        SELECT m.* 
        FROM LikeMovie lm
        INNER JOIN Movie m ON lm.MovieID = m.MovieID
        WHERE lm.CustomerID = @customerId
          AND lm.IsLiked = 1
          AND m.IsActive = 1
        ORDER BY m.MovieID DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);
    
    return {
      movies: result.recordset,
      total
    };
  }
}

module.exports = LikeMovieModel;