import { Router } from 'express';

// Import route modules
import authRoutes from './auth/auth.routes';
import cinemaRoutes from './cinema/cinema.routes';
import movieRoutes from './movie/movie.routes';
import showRoutes from './show/show.routes';
import adminRoutes from './admin/admin.routes';
// import bookingRoutes from './booking/booking.routes';
// import customerRoutes from './customer/customer.routes';
// import notificationRoutes from './notification/notification.routes';
// import paymentRoutes from './payment/payment.routes';
// import productRoutes from './product/product.routes';
// import voucherRoutes from './voucher/voucher.routes';

const router = Router();

// Mount routes under /api
router.use('/auth', authRoutes);
router.use('/cinema', cinemaRoutes);
router.use('/movie', movieRoutes);
router.use('/show', showRoutes);
router.use('/admin', adminRoutes);
// router.use('/booking', bookingRoutes);
// router.use('/customer', customerRoutes);
// router.use('/notification', notificationRoutes);
// router.use('/payment', paymentRoutes);
// router.use('/product', productRoutes);
// router.use('/voucher', voucherRoutes);

export default router;
