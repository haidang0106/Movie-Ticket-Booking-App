import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cấu hình Transporter thông qua Nodemailer để gửi Email (ví dụ: cấp phát OTP).
 */
export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // Dùng false cho giao thức STARTTLS (port 587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Helper hỗ trợ kiểm tra kết nối SMTP lúc ứng dụng khởi động.
 */
export const verifyEmailConnection = async () => {
  // Chỉ kiểm tra nếu cấu hình env đã điền (tránh rác Error console môi trường Dev)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('[⚠️ Email]   Bỏ qua test kết nối (SMTP_USER/PASS bị trống).');
    return;
  }

  try {
    const success = await emailTransporter.verify();
    if (success) {
      console.log('[📧 Email]   Cấu hình SMTP hợp lệ. Sẵn sàng gửi mail.');
    }
  } catch (error: any) {
    console.error('[❌ Email]   Lỗi xác thực SMTP:', error.message);
  }
};
