/**
 * Not Found Middleware — Xử lý route không tồn tại (404)
 * 
 * Đặt SAU tất cả routes, TRƯỚC errorHandler trong server.js
 */
const { AppError } = require('../utils');

const notFound = (req, res, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} không tồn tại`, 'ROUTE_NOT_FOUND'));
};

module.exports = { notFound };
