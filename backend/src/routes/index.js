const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth/auth.routes');
const bookingRoutes = require('./booking/booking.routes');
const cinemaRoutes = require('./cinema');
const customerRoutes = require('./customer/customer.routes');
const movieRoutes = require('./movie/movie.routes');
const notificationRoutes = require('./notification/notification.routes');
const paymentRoutes = require('./payment/payment.routes');
const productRoutes = require('./product/product.routes');
const voucherRoutes = require('./voucher/voucher.routes');
const adminRoutes = require('./admin/admin.routes');

// Mount routes under /api
router.use('/auth', authRoutes);
router.use('/booking', bookingRoutes);
router.use('/cinema', cinemaRoutes); // This will mount /cinema/* routes
router.use('/customer', customerRoutes);
router.use('/movie', movieRoutes);
router.use('/notification', notificationRoutes);
router.use('/payment', paymentRoutes);
router.use('/product', productRoutes);
router.use('/voucher', voucherRoutes);
router.use('/admin', adminRoutes);

module.exports = router;