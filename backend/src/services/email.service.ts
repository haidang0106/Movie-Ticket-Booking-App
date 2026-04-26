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
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[⚠️ Email] SMTP failed or rejected by provider. Logging OTP for local testing.`);
        console.log(`[🔑 OTP for ${email}] -> ${otp}`);
        return;
      }
      console.error('[email.service] Lỗi gửi Email:', error.message);
      throw error;
    }
  }

  static async sendResetPasswordOtpEmail(email: string, otp: string) {
    const isSmtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);

    if (!isSmtpConfigured && process.env.NODE_ENV !== 'production') {
      console.warn(`[⚠️ Email] SMTP is not fully configured. Logging Reset OTP for local testing.`);
      console.log(`[🔑 Reset OTP for ${email}] -> ${otp}`);
      return;
    }

    if (!isSmtpConfigured && process.env.NODE_ENV === 'production') {
      throw new Error('SMTP is not configured in production environment.');
    }

    const mailOptions = {
      from: process.env.SMTP_USER || '"Movie Ticket Booking" <no-reply@movie.com>',
      to: email,
      subject: 'Movie Ticket Booking - Reset your password',
      html: `
        <p>Your password reset code is: <strong style="font-size:18px;">${otp}</strong>.</p>
        <p>This code will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    try {
      await emailTransporter.sendMail(mailOptions);
    } catch (error: any) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[⚠️ Email] SMTP failed or rejected by provider. Logging Reset OTP for local testing.`);
        console.log(`[🔑 Reset OTP for ${email}] -> ${otp}`);
        return;
      }
      console.error('[email.service] Lỗi gửi Email Reset Password:', error.message);
      throw error;
    }
  }
}
