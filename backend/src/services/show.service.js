const { AppError } = require('../utils');
const showModel = require('../models/show.model');
const movieModel = require('../models/movie.model');

/**
 * Lấy danh sách suất chiếu có phân trang và bộ lọc
 */
const getAll = async ({ page = 1, limit = 20, filters = {} }) => {
  const offset = (page - 1) * limit;
  const { shows, total } = await showModel.findAll({ offset, limit, filters });
  return { shows, total };
};

/**
 * Lấy chi tiết suất chiếu theo ID
 */
const getById = async (id) => {
  const show = await showModel.findById(id);
  if (!show) {
    throw AppError.notFound('Suất chiếu không tồn tại', 'SHOW_NOT_FOUND');
  }
  return show;
};

/**
 * Lấy suất chiếu theo cụm rạp và ngày
 */
const getByCinemaAndDate = async (cinemaId, date) => {
  return await showModel.findByCinemaAndDate(cinemaId, date);
};

/**
 * Tạo suất chiếu mới
 */
const create = async (showData) => {
  // Kiểm tra trường bắt buộc
  const requiredFields = ['movieId', 'hallId', 'showDate', 'showTime', 'format', 'basePrice'];
  for (const field of requiredFields) {
    if (!showData[field]) {
      throw AppError.badRequest(`${field} là bắt buộc`, `MISSING_${field.toUpperCase()}`);
    }
  }
  
  // Tự tính endTime nếu không truyền (thời lượng phim + 15 phút nghỉ)
  if (!showData.endTime) {
    const movie = await movieModel.findById(showData.movieId);
    if (movie && movie.MovieRuntime) {
      const [hours, minutes] = showData.showTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + movie.MovieRuntime + 15;
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      showData.endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    } else {
      throw AppError.badRequest('endTime là bắt buộc khi không xác định được thời lượng phim', 'MISSING_ENDTIME');
    }
  }
  
  // Kiểm tra xung đột lịch chiếu
  const hasConflict = await showModel.checkConflict(
    showData.hallId, showData.showDate, showData.showTime, showData.endTime
  );
  if (hasConflict) {
    throw AppError.conflict('Lịch chiếu bị trùng với suất chiếu khác trong cùng phòng', 'SHOW_SCHEDULE_CONFLICT');
  }
  
  const show = await showModel.create(showData);
  return show;
};

/**
 * Cập nhật suất chiếu
 */
const update = async (id, showData) => {
  const show = await showModel.findById(id);
  if (!show) {
    throw AppError.notFound('Suất chiếu không tồn tại', 'SHOW_NOT_FOUND');
  }
  
  // Kiểm tra xung đột nếu thay đổi phòng/ngày/giờ
  if (showData.hallId || showData.showDate || showData.showTime || showData.endTime) {
    const hallId = showData.hallId || show.HallID;
    const showDate = showData.showDate || show.ShowDate;
    const showTime = showData.showTime || show.ShowTime;
    const endTime = showData.endTime || show.EndTime;
    
    const hasConflict = await showModel.checkConflict(hallId, showDate, showTime, endTime, id);
    if (hasConflict) {
      throw AppError.conflict('Lịch chiếu bị trùng với suất chiếu khác trong cùng phòng', 'SHOW_SCHEDULE_CONFLICT');
    }
  }
  
  // Gộp với dữ liệu hiện tại
  const mergedData = {
    movieId: showData.movieId || show.MovieID,
    hallId: showData.hallId || show.HallID,
    showDate: showData.showDate || show.ShowDate,
    showTime: showData.showTime || show.ShowTime,
    endTime: showData.endTime || show.EndTime,
    format: showData.format || show.Format,
    basePrice: showData.basePrice !== undefined ? showData.basePrice : show.BasePrice
  };
  
  const updatedShow = await showModel.update(id, mergedData);
  return updatedShow;
};

/**
 * Xóa suất chiếu
 */
const remove = async (id) => {
  const show = await showModel.findById(id);
  if (!show) {
    throw AppError.notFound('Suất chiếu không tồn tại', 'SHOW_NOT_FOUND');
  }
  await showModel.delete(id);
  return true;
};

/**
 * Lấy sơ đồ ghế cho suất chiếu (bao gồm trạng thái đặt chỗ)
 */
const getShowSeats = async (showId) => {
  const show = await showModel.findById(showId);
  if (!show) {
    throw AppError.notFound('Suất chiếu không tồn tại', 'SHOW_NOT_FOUND');
  }
  return await showModel.getShowSeats(showId);
};

module.exports = {
  getAll,
  getById,
  getByCinemaAndDate,
  create,
  update,
  delete: remove,
  getShowSeats
};