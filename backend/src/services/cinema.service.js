const { AppError } = require('../utils');
const cinemaModel = require('../models/cinema.model');

/**
 * Lấy danh sách cụm rạp có phân trang và bộ lọc
 */
const getAll = async ({ page = 1, limit = 20, filters = {} }) => {
  const offset = (page - 1) * limit;
  const { cinemas, total } = await cinemaModel.findAll({ offset, limit, filters });
  return { cinemas, total };
};

/**
 * Lấy chi tiết cụm rạp theo ID
 */
const getById = async (id) => {
  const cinema = await cinemaModel.findById(id);
  if (!cinema) {
    throw AppError.notFound('Cụm rạp không tồn tại', 'CINEMA_NOT_FOUND');
  }
  return cinema;
};

/**
 * Thêm cụm rạp mới
 */
const create = async (cinemaData) => {
  // Kiểm tra trường bắt buộc
  const requiredFields = ['name', 'cityId'];
  for (const field of requiredFields) {
    if (!cinemaData[field]) {
      throw AppError.badRequest(`${field} là bắt buộc`, `MISSING_${field.toUpperCase()}`);
    }
  }
  
  const cinema = await cinemaModel.create(cinemaData);
  return cinema;
};

/**
 * Cập nhật thông tin cụm rạp
 */
const update = async (id, cinemaData) => {
  const cinema = await cinemaModel.findById(id);
  if (!cinema) {
    throw AppError.notFound('Cụm rạp không tồn tại', 'CINEMA_NOT_FOUND');
  }
  
  const updatedCinema = await cinemaModel.update(id, cinemaData);
  return updatedCinema;
};

module.exports = {
  getAll,
  getById,
  create,
  update
};