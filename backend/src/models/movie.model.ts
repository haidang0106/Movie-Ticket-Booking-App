import sql from 'mssql';
import { getPool } from '../config/database';

export interface MovieFilters {
  genre?: string;
  language?: string;
  isActive?: boolean | number;
  isFeatured?: boolean | number;
}

export interface MovieData {
  title: string;
  genre: string;
  language: string;
  runtime: number;
  releaseDate: Date | string;
  actor?: string;
  director?: string;
  description?: string;
  trailerUrl?: string;
  rating?: number;
  isFeatured?: boolean | number;
  featuredOrder?: number;
  isActive?: boolean | number;
}

export class MovieModel {
  /**
   * Lấy danh sách phim có phân trang và bộ lọc
   */
  static async findAll({ offset = 0, limit = 20, filters = {} }: { offset?: number; limit?: number; filters?: MovieFilters }) {
    const pool = getPool();
    
    // Tạo request riêng cho count và data (tránh xung đột input params)
    const countRequest = pool.request();
    const dataRequest = pool.request();
    
    let whereConditions: string[] = [];
    
    if (filters.genre) {
      whereConditions.push('MovieGenre LIKE @genre');
      countRequest.input('genre', sql.NVarChar, `%${filters.genre}%`);
      dataRequest.input('genre', sql.NVarChar, `%${filters.genre}%`);
    }
    
    if (filters.language) {
      whereConditions.push('MovieLanguage = @language');
      countRequest.input('language', sql.NVarChar, filters.language);
      dataRequest.input('language', sql.NVarChar, filters.language);
    }
    
    if (filters.isActive !== undefined) {
      whereConditions.push('IsActive = @isActive');
      const isActiveVal = filters.isActive ? 1 : 0;
      countRequest.input('isActive', sql.Bit, isActiveVal);
      dataRequest.input('isActive', sql.Bit, isActiveVal);
    }
    
    if (filters.isFeatured !== undefined) {
      whereConditions.push('IsFeatured = @isFeatured');
      const isFeaturedVal = filters.isFeatured ? 1 : 0;
      countRequest.input('isFeatured', sql.Bit, isFeaturedVal);
      dataRequest.input('isFeatured', sql.Bit, isFeaturedVal);
    }
    
    const whereSQL = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    // Đếm tổng số bản ghi
    const countResult = await countRequest.query(`
      SELECT COUNT(*) AS total 
      FROM Movie 
      ${whereSQL}
    `);
    
    const total = countResult.recordset[0].total;
    
    // Lấy dữ liệu phân trang
    dataRequest.input('offset', sql.Int, offset);
    dataRequest.input('limit', sql.Int, limit);
    
    const result = await dataRequest.query(`
      SELECT * FROM Movie 
      ${whereSQL}
      ORDER BY MovieID DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);
    
    return {
      movies: result.recordset,
      total
    };
  }
  
  /**
   * Lấy danh sách phim nổi bật (đang chiếu)
   */
  static async findFeatured() {
    const pool = getPool();
    const result = await pool.request()
      .query(`
        SELECT * FROM Movie 
        WHERE IsFeatured = 1 AND IsActive = 1
        ORDER BY FeaturedOrder ASC, MovieID DESC
      `);
    return { movies: result.recordset };
  }
  
  /**
   * Tìm kiếm phim theo từ khóa (tên, thể loại, ngôn ngữ)
   */
  static async search(query: string, { offset = 0, limit = 20 }: { offset?: number; limit?: number }) {
    const pool = getPool();
    
    // Đếm tổng số kết quả
    const countResult = await pool.request()
      .input('query', sql.NVarChar, `%${query}%`)
      .query(`
        SELECT COUNT(*) AS total 
        FROM Movie 
        WHERE (MovieTitle LIKE @query OR MovieGenre LIKE @query OR MovieLanguage LIKE @query)
          AND IsActive = 1
      `);
    
    const total = countResult.recordset[0].total;
    
    // Lấy dữ liệu phân trang
    const result = await pool.request()
      .input('query', sql.NVarChar, `%${query}%`)
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(`
        SELECT * FROM Movie 
        WHERE (MovieTitle LIKE @query OR MovieGenre LIKE @query OR MovieLanguage LIKE @query)
          AND IsActive = 1
        ORDER BY MovieID DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);
    
    return {
      movies: result.recordset,
      total
    };
  }
  
  /**
   * Lấy chi tiết phim theo ID
   */
  static async findById(id: number) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Movie WHERE MovieID = @id');
    return result.recordset[0] || null;
  }
  
  /**
   * Thêm phim mới
   */
  static async create(movieData: MovieData) {
    const pool = getPool();
    const result = await pool.request()
      .input('title', sql.NVarChar, movieData.title)
      .input('genre', sql.NVarChar, movieData.genre)
      .input('language', sql.NVarChar, movieData.language)
      .input('runtime', sql.Int, movieData.runtime)
      .input('releaseDate', sql.Date, movieData.releaseDate)
      .input('actor', sql.NVarChar, movieData.actor || null)
      .input('director', sql.NVarChar, movieData.director || null)
      .input('description', sql.NVarChar, movieData.description || null)
      .input('trailerUrl', sql.NVarChar, movieData.trailerUrl || null)
      .input('rating', sql.Decimal(3, 1), movieData.rating || null)
      .input('isFeatured', sql.Bit, movieData.isFeatured ? 1 : 0)
      .input('featuredOrder', sql.Int, movieData.featuredOrder || 0)
      .input('isActive', sql.Bit, movieData.isActive !== undefined ? movieData.isActive : 1)
      .query(`
        INSERT INTO Movie (
          MovieTitle, MovieGenre, MovieLanguage, MovieRuntime, MovieReleaseDate,
          MovieActor, MovieDirector, MovieDescription, TrailerUrl, Rating,
          IsFeatured, FeaturedOrder, IsActive
        ) 
        OUTPUT INSERTED.*
        VALUES (
          @title, @genre, @language, @runtime, @releaseDate,
          @actor, @director, @description, @trailerUrl, @rating,
          @isFeatured, @featuredOrder, @isActive
        )
      `);
    return result.recordset[0];
  }
  
  /**
   * Cập nhật thông tin phim
   */
  static async update(id: number, movieData: MovieData) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, movieData.title)
      .input('genre', sql.NVarChar, movieData.genre)
      .input('language', sql.NVarChar, movieData.language)
      .input('runtime', sql.Int, movieData.runtime)
      .input('releaseDate', sql.Date, movieData.releaseDate)
      .input('actor', sql.NVarChar, movieData.actor || null)
      .input('director', sql.NVarChar, movieData.director || null)
      .input('description', sql.NVarChar, movieData.description || null)
      .input('trailerUrl', sql.NVarChar, movieData.trailerUrl || null)
      .input('rating', sql.Decimal(3, 1), movieData.rating || null)
      .input('isFeatured', sql.Bit, movieData.isFeatured ? 1 : 0)
      .input('featuredOrder', sql.Int, movieData.featuredOrder || 0)
      .input('isActive', sql.Bit, movieData.isActive !== undefined ? movieData.isActive : 1)
      .query(`
        UPDATE Movie SET
          MovieTitle = @title,
          MovieGenre = @genre,
          MovieLanguage = @language,
          MovieRuntime = @runtime,
          MovieReleaseDate = @releaseDate,
          MovieActor = @actor,
          MovieDirector = @director,
          MovieDescription = @description,
          TrailerUrl = @trailerUrl,
          Rating = @rating,
          IsFeatured = @isFeatured,
          FeaturedOrder = @featuredOrder,
          IsActive = @isActive
        WHERE MovieID = @id
      `);
    return { ...movieData, MovieID: id };
  }
  
  /**
   * Xóa mềm phim (chỉ set IsActive = 0)
   */
  static async softDelete(id: number) {
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE Movie SET IsActive = 0 WHERE MovieID = @id');
    return { MovieID: id };
  }
  
  /**
   * Bật/tắt trạng thái phim nổi bật
   */
  static async toggleFeatured(id: number) {
    const pool = getPool();
    
    // Lấy thông tin phim hiện tại
    const movieResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Movie WHERE MovieID = @id');
    
    const movie = movieResult.recordset[0];
    if (!movie) throw new Error('Phim không tồn tại');
    
    const newFeatured = !movie.IsFeatured;
    let newFeaturedOrder = movie.FeaturedOrder;
    
    if (newFeatured) {
      // Lấy thứ tự nổi bật lớn nhất + 1
      const maxResult = await pool.request()
        .query('SELECT ISNULL(MAX(FeaturedOrder), 0) AS maxOrder FROM Movie WHERE IsFeatured = 1');
      newFeaturedOrder = maxResult.recordset[0].maxOrder + 1;
    } else {
      // Đặt về 0 khi bỏ nổi bật
      newFeaturedOrder = 0;
    }
    
    // Cập nhật phim
    await pool.request()
      .input('id', sql.Int, id)
      .input('isFeatured', sql.Bit, newFeatured ? 1 : 0)
      .input('featuredOrder', sql.Int, newFeaturedOrder)
      .query(`
        UPDATE Movie SET
          IsFeatured = @isFeatured,
          FeaturedOrder = @featuredOrder
        WHERE MovieID = @id
      `);
    
    return { ...movie, IsFeatured: newFeatured, FeaturedOrder: newFeaturedOrder };
  }
  
  /**
   * Lấy thứ tự nổi bật lớn nhất (dùng cho admin)
   */
  static async getMaxFeaturedOrder() {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT ISNULL(MAX(FeaturedOrder), 0) AS maxOrder FROM Movie WHERE IsFeatured = 1');
    return result.recordset[0].maxOrder;
  }
  
  /**
   * Thích/bỏ thích phim (toggle)
   */
  static async toggleLike(movieId: number, customerId: number) {
    const pool = getPool();
    
    // Kiểm tra đã thích chưa
    const existing = await pool.request()
      .input('movieId', sql.Int, movieId)
      .input('customerId', sql.Int, customerId)
      .query('SELECT * FROM LikeMovie WHERE MovieID = @movieId AND CustomerID = @customerId');
    
    if (existing.recordset.length > 0) {
      // Bỏ thích
      await pool.request()
        .input('movieId', sql.Int, movieId)
        .input('customerId', sql.Int, customerId)
        .query('DELETE FROM LikeMovie WHERE MovieID = @movieId AND CustomerID = @customerId');
      return false;
    } else {
      // Thích
      await pool.request()
        .input('movieId', sql.Int, movieId)
        .input('customerId', sql.Int, customerId)
        .query(`
          INSERT INTO LikeMovie (MovieID, CustomerID, IsLiked)
          VALUES (@movieId, @customerId, 1)
        `);
      return true;
    }
  }
  
  /**
   * Lấy trạng thái thích phim của khách hàng
   */
  static async getLikeStatus(movieId: number, customerId: number) {
    const pool = getPool();
    const result = await pool.request()
      .input('movieId', sql.Int, movieId)
      .input('customerId', sql.Int, customerId)
      .query('SELECT IsLiked FROM LikeMovie WHERE MovieID = @movieId AND CustomerID = @customerId');
    
    return result.recordset.length > 0 ? result.recordset[0].IsLiked : false;
  }
}
