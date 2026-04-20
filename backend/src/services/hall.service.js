const { AppError } = require('../utils');
const hallModel = require('../models/hall.model');
const seatModel = require('../models/seat.model');

/**
 * Lấy danh sách phòng chiếu theo cụm rạp
 */
const getByCinema = async (cinemaId) => {
  const halls = await hallModel.findByCinema(cinemaId);
  return halls;
};

/**
 * Lấy chi tiết phòng chiếu theo ID
 */
const getById = async (id) => {
  const hall = await hallModel.findById(id);
  if (!hall) {
    throw AppError.notFound('Phòng chiếu không tồn tại', 'HALL_NOT_FOUND');
  }
  return hall;
};

/**
 * Thêm phòng chiếu mới
 */
const create = async (hallData) => {
  // Kiểm tra trường bắt buộc
  const requiredFields = ['cinemaId', 'name', 'totalRows', 'totalCols'];
  for (const field of requiredFields) {
    if (hallData[field] === undefined || hallData[field] === null) {
      throw AppError.badRequest(`${field} là bắt buộc`, `MISSING_${field.toUpperCase()}`);
    }
  }
  
  // Kiểm tra cụm rạp tồn tại
  const cinemaExists = await hallModel.checkCinemaExists(hallData.cinemaId);
  if (!cinemaExists) {
    throw AppError.notFound('Cụm rạp không tồn tại', 'CINEMA_NOT_FOUND');
  }
  
  // Tính tổng số ghế
  hallData.totalSeats = hallData.totalRows * hallData.totalCols;
  
  const hall = await hallModel.create(hallData);
  return hall;
};

/**
 * Cập nhật thông tin phòng chiếu
 */
const update = async (id, hallData) => {
  const hall = await hallModel.findById(id);
  if (!hall) {
    throw AppError.notFound('Phòng chiếu không tồn tại', 'HALL_NOT_FOUND');
  }
  
  // Nếu kích thước thay đổi, tính lại tổng số ghế
  if (hallData.totalRows !== undefined || hallData.totalCols !== undefined) {
    const rows = hallData.totalRows !== undefined ? hallData.totalRows : hall.TotalRows;
    const cols = hallData.totalCols !== undefined ? hallData.totalCols : hall.TotalCols;
    hallData.totalSeats = rows * cols;
  }
  
  const updatedHall = await hallModel.update(id, hallData);
  return updatedHall;
};

/**
 * Cấu hình phòng chiếu cho cụm rạp (Admin) — thay thế toàn bộ
 */
const configureHalls = async (cinemaId, hallsData) => {
  // Kiểm tra cụm rạp tồn tại
  const cinemaExists = await hallModel.checkCinemaExists(cinemaId);
  if (!cinemaExists) {
    throw AppError.notFound('Cụm rạp không tồn tại', 'CINEMA_NOT_FOUND');
  }
  
  // Kiểm tra dữ liệu từng phòng chiếu
  for (const hallData of hallsData) {
    const requiredFields = ['name', 'totalRows', 'totalCols'];
    for (const field of requiredFields) {
      if (hallData[field] === undefined) {
        throw AppError.badRequest(`${field} là bắt buộc cho phòng chiếu`, `MISSING_${field.toUpperCase()}`);
      }
    }
    // Gán cinemaId và tính totalSeats
    hallData.cinemaId = cinemaId;
    hallData.totalSeats = hallData.totalRows * hallData.totalCols;
  }
  
  // Xóa phòng chiếu cũ và tạo mới
  await hallModel.deleteByCinema(cinemaId);
  const halls = await hallModel.createMany(hallsData);
  
  return { message: 'Cấu hình phòng chiếu thành công', count: halls.length };
};

/**
 * Thiết lập sơ đồ ghế cho phòng chiếu (Admin) — thay thế toàn bộ
 */
const setupSeats = async (hallId, seatsData) => {
  // Kiểm tra phòng chiếu tồn tại
  const hallExists = await hallModel.checkHallExists(hallId);
  if (!hallExists) {
    throw AppError.notFound('Phòng chiếu không tồn tại', 'HALL_NOT_FOUND');
  }
  
  // Kiểm tra dữ liệu từng ghế
  for (const seatData of seatsData) {
    const requiredFields = ['seatNumber', 'seatType', 'rowIndex', 'colIndex'];
    for (const field of requiredFields) {
      if (seatData[field] === undefined) {
        throw AppError.badRequest(`${field} là bắt buộc cho ghế`, `MISSING_${field.toUpperCase()}`);
      }
    }
    // Gán hallId
    seatData.hallId = hallId;
  }
  
  // Xóa ghế cũ và tạo mới
  await seatModel.deleteByHall(hallId);
  const seats = await seatModel.createMany(seatsData);
  
  // Cập nhật tổng số ghế (trừ ghế lối đi)
  const actualSeats = seats.filter(s => !s.IsAisle).length;
  await hallModel.updateTotalSeats(hallId, actualSeats);
  
  return { message: 'Thiết lập sơ đồ ghế thành công', count: seats.length };
};

/**
 * Lấy sơ đồ ghế của phòng chiếu
 */
const getSeatsByHallId = async (hallId) => {
  const hallExists = await hallModel.checkHallExists(hallId);
  if (!hallExists) {
    throw AppError.notFound('Phòng chiếu không tồn tại', 'HALL_NOT_FOUND');
  }
  return await hallModel.findSeatsByHallId(hallId);
};

module.exports = {
  getByCinema,
  getById,
  create,
  update,
  configureHalls,
  setupSeats,
  getSeatsByHallId
};