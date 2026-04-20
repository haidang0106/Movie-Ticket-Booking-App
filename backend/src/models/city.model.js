const { mssql } = require('../config/db');

class CityModel {
  // Get all cities
  static async findAll() {
    const pool = await mssql.connect();
    const result = await pool.request()
      .query('SELECT * FROM City ORDER BY CityName');
    return result.recordset;
  }
  
  // Get city by ID
  static async findById(id) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query('SELECT * FROM City WHERE CityID = @id');
    return result.recordset[0] || null;
  }
  
  // Create city
  static async create(cityData) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('name', mssql.NVarChar, cityData.name)
      .input('createdBy', mssql.Int, cityData.createdBy)
      .query(`
        INSERT INTO City (
          CityName, CreatedBy
        ) 
        OUTPUT INSERTED.*
        VALUES (
          @name, @createdBy
        )
      `);
    return result.recordset[0];
  }
  
  // Update city
  static async update(id, cityData) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .input('name', mssql.NVarChar, cityData.name)
      .input('updatedBy', mssql.Int, cityData.updatedBy)
      .query(`
        UPDATE City SET
          CityName = @name,
          UpdatedBy = @updatedBy,
          UpdatedAt = GETDATE()
        WHERE CityID = @id
      `);
    return { ...cityData, CityID: id };
  }
  
  // Delete city
  static async delete(id) {
    const pool = await mssql.connect();
    await pool.request()
      .input('id', mssql.Int, id)
      .query('UPDATE City SET IsActive = 0, UpdatedAt = GETDATE() WHERE CityID = @id');
    return { CityID: id };
  }
  
  // Check if city exists
  static async checkCityExists(id) {
    const pool = await mssql.connect();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query('SELECT COUNT(*) AS count FROM City WHERE CityID = @id');
    return result.recordset[0].count > 0;
  }
}

module.exports = CityModel;