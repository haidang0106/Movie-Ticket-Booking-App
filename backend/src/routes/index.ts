import { Router } from 'express';

// Import route modules
import authRoutes from './auth/auth.routes';
// import bookingRoutes from './booking/booking.routes';
// import cinemaRoutes from './cinema';
// import customerRoutes from './customer/customer.routes';
import movieRoutes from './movie/movie.routes';
// import notificationRoutes from './notification/notification.routes';
// import paymentRoutes from './payment/payment.routes';
// import productRoutes from './product/product.routes';
// import voucherRoutes from './voucher/voucher.routes';
// import adminRoutes from './admin/admin.routes';

const router = Router();

// Mount routes under /api
router.use('/auth', authRoutes);
// router.use('/booking', bookingRoutes);
// router.use('/cinema', cinemaRoutes);
// router.use('/customer', customerRoutes);
router.use('/movie', movieRoutes);
// router.use('/notification', notificationRoutes);
// router.use('/payment', paymentRoutes);
// router.use('/product', productRoutes);
// router.use('/voucher', voucherRoutes);
// router.use('/admin', adminRoutes);

export default router;
