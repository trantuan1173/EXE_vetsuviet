const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.MAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.MAIL_PORT, 10) || 587;
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  console.log('📧 Email config:', {
    host,
    port,
    user: user ? `${user.substring(0, 3)}***` : 'NOT SET',
    from: process.env.MAIL_FROM ? `${process.env.MAIL_FROM.substring(0, 3)}***` : 'NOT SET',
  });

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
  });
};

const emailService = {
  sendResetPasswordEmail: async (to, resetToken) => {
    const clientUrl = 'https://vetsuviet.gicunhco.com';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Vết Sử Việt" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
      to,
      subject: 'Đặt lại mật khẩu - Vết Sử Việt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #B45309; margin: 0;">Vết Sử Việt</h1>
          </div>
          <h2 style="color: #1F2937;">Đặt lại mật khẩu</h2>
          <p style="color: #4B5563; line-height: 1.6;">
            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.
            Nhấn vào nút bên dưới để đặt lại mật khẩu:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #B45309; color: white; padding: 12px 30px;
                      text-decoration: none; border-radius: 6px; font-weight: bold;
                      display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p style="color: #4B5563; line-height: 1.6;">
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            Link sẽ hết hạn sau <strong>15 phút</strong>.
          </p>
          <p style="color: #9CA3AF; font-size: 12px; line-height: 1.6;">
            Nếu nút không hoạt động, hãy sao chép và dán link sau vào trình duyệt:<br/>
            <a href="${resetUrl}" style="color: #B45309;">${resetUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Vết Sử Việt. All rights reserved.
          </p>
        </div>
      `,
    };

    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reset password email sent:', info.messageId);
  },
};

module.exports = emailService;