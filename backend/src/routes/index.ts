import { Router } from 'express';

// Import route modules
import authRoutes from './auth.routes';
import customerRoutes from './customer.routes';
import movieRoutes from './movie.routes';
import cinemaRoutes from './cinema.routes';
import showRoutes from './show.routes';
import adminRoutes from './admin.routes';
// import bookingRoutes from './booking.routes';
// import notificationRoutes from './notification.routes';
// import paymentRoutes from './payment.routes';
// import productRoutes from './product.routes';
// import voucherRoutes from './voucher.routes';

const router = Router();

// Mount routes under /api
router.use('/auth', authRoutes);
router.use('/customer', customerRoutes);
router.use('/movies', movieRoutes);
router.use('/cinemas', cinemaRoutes);
router.use('/shows', showRoutes);
router.use('/admin', adminRoutes);
// router.use('/bookings', bookingRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/products', productRoutes);
// router.use('/vouchers', voucherRoutes);

export default router;
