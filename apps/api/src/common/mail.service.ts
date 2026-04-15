import nodemailer from 'nodemailer';
// import QRCode from "qrcode";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (options: { to: string; subject: string; html: string }) => {
  return await transporter.sendMail(options);
};

export const getOtpTemplate = (email: string, otp: string) => ({
  to: email,
  subject: `[PvM.app] ${otp} là mã xác thực của bạn`,
  html: `
      <div style="background-color: #020617; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 24px; border: 1px solid #1e293b; overflow: hidden;">
          <tr>
            <td style="padding: 40px 20px; text-align: center; color: #ffffff;">
              
              <h1 style="margin: 0; font-size: 28px; color: #ef4444; letter-spacing: -1px;">
                CINEMA<span style="color: #ffffff;">APP</span>
              </h1>
              
              <p style="color: #94a3b8; font-size: 16px; margin-top: 10px;">Xác thực tài khoản của bạn</p>
              
              <div style="margin: 30px 0; padding: 30px; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155;">
                <p style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 2px;">Mã OTP của bạn là</p>
                
                <div style="
                  font-size: 42px; 
                  font-weight: 800; 
                  letter-spacing: 10px; 
                  color: #ffffff; 
                  text-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
                  user-select: all;
                  -webkit-user-select: all;
                ">
                  <span style="font-family: monospace; cursor: pointer;">${otp}</span>
                </div>
                
                <p style="margin-top: 15px; font-size: 11px; color: #475569;">(Nhấn giữ vào số trên để sao chép)</p>
              </div>

              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 0;">
                Mã này sẽ hết hạn trong <strong style="color: #f1f5f9;">10 phút</strong>.<br>
                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
              </p>
              
            </td>
          </tr>
        </table>
      </div>
    `,
});

export const getResetPasswordTemplate = (email: string, resetUrl: string) => ({
  to: email,
  subject: 'Đặt lại mật khẩu',
  html: `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
          <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;padding:40px 30px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">

            <h2 style="margin:0 0 20px;color:#111;font-size:24px;">
              Đặt lại mật khẩu
            </h2>

            <p style="color:#555;font-size:15px;line-height:1.6;">
              Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
              Hãy nhấn vào nút bên dưới để tạo mật khẩu mới.
            </p>

            <div style="text-align:center;margin:30px 0;">
              <a href="${resetUrl}" 
                style="
                  background:#e11d48;
                  color:#ffffff;
                  padding:14px 28px;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:600;
                  display:inline-block;
                  font-size:15px;
                "
              >
                Đặt lại mật khẩu
              </a>
            </div>

            <p style="color:#777;font-size:14px;line-height:1.6;">
              Nếu bạn không yêu cầu đặt lại mật khẩu, bạn có thể bỏ qua email này.
            </p>

            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;" />

            <p style="color:#999;font-size:12px;text-align:center;">
              Liên kết này sẽ hết hạn sau 10 phút để đảm bảo an toàn.
            </p>

          </div>
        </div>
      `,
});

export const getBookingSuccessTemplate = (payload: {
  email: string;
  customerName: string;
  ticketCode: string;
  movieName?: string;
  seatCodes?: string[];
  showDate?: string;
  showTime?: string;
  cinemaName?: string;
  roomName?: string;
  totalAmount?: number;
  paymentMethod?: string;
  bookedAt?: Date;
}) => {
  const bookedTime = payload.bookedAt
    ? new Date(payload.bookedAt).toLocaleString('vi-VN')
    : new Date().toLocaleString('vi-VN');

  return {
    to: payload.email,
    subject: 'Xác nhận đặt vé thành công',
    html: `
      <div style="margin:0; padding:32px 16px; background:#f3f4f6; font-family:Arial, sans-serif; color:#111827;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
          
          <div style="padding:28px 32px; background:linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);">
            <div style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#fee2e2;">
              Xác nhận đặt vé
            </div>
            <h2 style="margin:10px 0 0; font-size:30px; line-height:1.2; color:#ffffff;">
              Đặt vé thành công
            </h2>
            <p style="margin:12px 0 0; color:#fee2e2; font-size:15px; line-height:1.7;">
              Xin chào <b>${payload.customerName || 'Quý khách'}</b>, đơn đặt vé của bạn đã được xác nhận thành công.
            </p>
          </div>

          <div style="padding:28px 32px;">
            <div style="margin-bottom:20px; padding:18px 20px; background:#fff5f5; border:1px solid #fecaca; border-radius:16px;">
              <div style="font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#b91c1c; margin-bottom:8px;">
                Mã vé
              </div>
              <div style="font-size:28px; font-weight:800; font-family:monospace; color:#dc2626;">
                ${payload.ticketCode || '---'}
              </div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0 12px;">
              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Phim
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.movieName || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Ghế
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${(payload.seatCodes || []).join(', ') || '---'}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Ngày chiếu
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.showDate || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Giờ chiếu
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.showTime || '---'}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Rạp
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.cinemaName || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Phòng
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.roomName || '---'}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Phương thức thanh toán
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.paymentMethod || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Tổng tiền
                    </div>
                    <div style="font-size:15px; color:#dc2626; font-weight:800;">
                      ${Number(payload.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <div style="margin-top:20px; padding:16px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:14px;">
              <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                Thời gian đặt vé
              </div>
              <div style="font-size:15px; color:#111827; font-weight:700;">
                ${bookedTime}
              </div>
            </div>

            <div style="margin-top:20px; padding:14px 16px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:14px;">
              <p style="margin:0; color:#1e3a8a; font-size:13px; line-height:1.7;">
                Vui lòng mang theo mã vé hoặc mở email này khi đến rạp. Bạn có thể đưa mã vé cho nhân viên hoặc sử dụng mã QR trên trang chi tiết vé trong tài khoản của mình.
              </p>
            </div>

            <p style="margin:18px 0 0; color:#9ca3af; font-size:12px; text-align:center;">
              Email tự động từ hệ thống rạp phim.
            </p>
          </div>
        </div>
      </div>
    `,
  };
};

export const getTicketPickupTemplate = (payload: {
  email: string;
  customerName: string;
  ticketCode: string;
  pickedUpAt: Date;
  movieName?: string;
  seatCodes?: string[];
  showDate?: string;
  showTime?: string;
  cinemaName?: string;
  roomName?: string;
  status?: string;
}) => {
  const pickedUpTime = payload.pickedUpAt
    ? new Date(payload.pickedUpAt).toLocaleString('vi-VN')
    : '---';

  return {
    to: payload.email,
    subject: 'Xác nhận đã nhận vé thành công',
    html: `
      <div style="margin:0; padding:32px 16px; background:#f3f4f6; font-family:Arial, sans-serif; color:#111827;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
          
          <div style="padding:28px 32px; background:linear-gradient(90deg, #166534 0%, #15803d 100%);">
            <div style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#dcfce7;">
              Xác nhận nhận vé
            </div>
            <h2 style="margin:10px 0 0; font-size:30px; line-height:1.2; color:#ffffff;">
              Vé đã được nhận thành công
            </h2>
            <p style="margin:12px 0 0; color:#dcfce7; font-size:15px; line-height:1.7;">
              Xin chào <b>${payload.customerName || 'Quý khách'}</b>, nhân viên rạp đã xác nhận bạn đã nhận vé thành công.
            </p>
          </div>

          <div style="padding:28px 32px;">
            <div style="margin-bottom:20px; padding:18px 20px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:16px;">
              <div style="font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#166534; margin-bottom:8px;">
                Mã vé
              </div>
              <div style="font-size:28px; font-weight:800; font-family:monospace; color:#15803d;">
                ${payload.ticketCode || '---'}
              </div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0 12px;">
              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Phim
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.movieName || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Ghế
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${(payload.seatCodes || []).join(', ') || '---'}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Ngày chiếu
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.showDate || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Giờ chiếu
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.showTime || '---'}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Rạp
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.cinemaName || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Phòng
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.roomName || '---'}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Thời gian nhận vé
                    </div>
                    <div style="font-size:15px; color:#15803d; font-weight:700;">
                      ${pickedUpTime}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Trạng thái
                    </div>
                    <div style="font-size:15px; color:#15803d; font-weight:700;">
                      ${payload.status || 'Đã nhận vé'}
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <div style="margin-top:20px; padding:14px 16px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:14px;">
              <p style="margin:0; color:#166534; font-size:13px; line-height:1.7;">
                Cảm ơn bạn đã sử dụng dịch vụ của hệ thống rạp phim. Vui lòng lưu lại email này để đối chiếu khi cần.
              </p>
            </div>

            <p style="margin:18px 0 0; color:#9ca3af; font-size:12px; text-align:center;">
              Email tự động từ hệ thống rạp phim.
            </p>
          </div>
        </div>
      </div>
    `,
  };
};

export const getContactTemplate = (payload: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return {
    to: process.env.EMAIL_USER || '',
    subject: `[Liên hệ] ${payload.subject}`,
    html: `
      <div style="margin:0; padding:32px 16px; background:#f3f4f6; font-family:Arial, sans-serif; color:#111827;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.06);">
          
          <div style="padding:28px 32px; background:linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);">
            <div style="font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#fee2e2;">
              Liên hệ từ website
            </div>
            <h2 style="margin:10px 0 0; font-size:30px; line-height:1.2; color:#ffffff;">
              Liên hệ mới từ website
            </h2>
            <p style="margin:12px 0 0; color:#fee2e2; font-size:15px; line-height:1.7;">
              Bạn vừa nhận được một yêu cầu liên hệ mới từ khách hàng.
            </p>
          </div>

          <div style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0 12px;">
              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Họ tên
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.fullName}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                      Email
                    </div>
                    <div style="font-size:15px; color:#111827; font-weight:700;">
                      ${payload.email}
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <div style="margin-top:4px; background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
              <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:6px;">
                Tiêu đề
              </div>
              <div style="font-size:15px; color:#111827; font-weight:700;">
                ${payload.subject}
              </div>
            </div>

            <div style="margin-top:12px; background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
              <div style="font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b7280; margin-bottom:10px;">
                Nội dung
              </div>
              <div style="font-size:14px; line-height:1.8; color:#111827; white-space:pre-line; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:14px;">
                ${payload.message}
              </div>
            </div>

            <div style="margin-top:20px; padding:14px 16px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:14px;">
              <p style="margin:0; color:#1e3a8a; font-size:13px; line-height:1.7;">
                Bạn có thể trả lời trực tiếp vào email này để phản hồi khách hàng.
              </p>
            </div>

            <p style="margin:18px 0 0; color:#9ca3af; font-size:12px; text-align:center;">
              Email tự động từ form Liên hệ của website.
            </p>
          </div>
        </div>
      </div>
    `,
  };
};

export const sendContactMailToAdmin = async (payload: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Thiếu cấu hình EMAIL_USER hoặc EMAIL_PASS');
  }

  return await transporter.sendMail({
    from: `"${payload.fullName}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: payload.email,
    subject: `[Liên hệ] ${payload.subject}`,
    html: getContactTemplate(payload).html,
  });
};