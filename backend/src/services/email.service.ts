import { emailTransporter } from '../config/email';

export class EmailService {
  static async sendOtpEmail(email: string, otp: string) {
    const isSmtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);

    if (!isSmtpConfigured && process.env.NODE_ENV !== 'production') {
      console.warn(`[⚠️ Email] SMTP is not fully configured. Logging OTP for local testing.`);
      console.log(`[🔑 OTP for ${email}] -> ${otp}`);
      return;
    }

    if (!isSmtpConfigured && process.env.NODE_ENV === 'production') {
      throw new Error('SMTP is not configured in production environment.');
    }

    const mailOptions = {
      from: process.env.SMTP_USER || '"Movie Ticket Booking" <no-reply@movie.com>',
      to: email,
      subject: 'Movie Ticket Booking - Verify your account',
      html: `
        <p>Your account registration verification code is: <strong style="font-size:18px;">${otp}</strong>.</p>
        <p>This code will expire in 5 minutes.</p>
      `,
    };

    try {
      await emailTransporter.sendMail(mailOptions);
    } catch (error: any) {
      console.error('[email.service] Lỗi gửi Email:', error.message);
      throw error;
    }
  }
}
