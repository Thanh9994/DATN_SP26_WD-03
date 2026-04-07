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
                  user-select: all; /* Hỗ trợ một số trình duyệt tự chọn toàn bộ khi chạm */
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
  subject: 'Reset Password',
  html: `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px 0;">
          <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;padding:40px 30px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">

            <h2 style="margin:0 0 20px;color:#111;font-size:24px;">
              Reset Your Password
            </h2>

            <p style="color:#555;font-size:15px;line-height:1.6;">
              We received a request to reset the password for your account.
              Click the button below to create a new password.
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
                ">
                Reset Password
              </a>
            </div>

            <p style="color:#777;font-size:14px;line-height:1.6;">
              If you did not request a password reset, you can safely ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;" />

            <p style="color:#999;font-size:12px;text-align:center;">
              This link will expire in 10 minutes for security reasons.
            </p>

          </div>
        </div>
      `,
});

export const getTicketPickupTemplate = (payload: {
  email: string;
  customerName: string;
  ticketCode: string;
  pickedUpAt: Date;
  movieName?: string;
  seatCodes?: string[];
}) => {
  const pickedUpTime = payload.pickedUpAt.toLocaleString('vi-VN');
  return {
    to: payload.email,
    subject: 'Xac nhan da nhan ve thanh cong',
    html: `
      <div style="font-family: Arial, sans-serif; background:#0b1020; padding:24px;">
        <div style="max-width:560px; margin:0 auto; background:#111827; border:1px solid #1f2937; border-radius:16px; padding:24px; color:#f3f4f6;">
          <h2 style="margin:0 0 12px; color:#22c55e;">Ve da duoc lay thanh cong</h2>
          <p style="margin:0 0 16px; color:#d1d5db;">Xin chao <b>${payload.customerName || 'Quy khach'}</b>, nhan vien rap da xac nhan ban da nhan ve.</p>
          <div style="background:#0f172a; border:1px solid #334155; border-radius:12px; padding:14px;">
            <p style="margin:0 0 8px;"><b>Ticket code:</b> ${payload.ticketCode}</p>
            <p style="margin:0 0 8px;"><b>Thoi gian nhan ve:</b> ${pickedUpTime}</p>
            <p style="margin:0 0 8px;"><b>Phim:</b> ${payload.movieName || '---'}</p>
            <p style="margin:0;"><b>Ghe:</b> ${(payload.seatCodes || []).join(', ') || '---'}</p>
          </div>
          <p style="margin-top:16px; color:#9ca3af; font-size:12px;">Email tu dong tu he thong rap phim.</p>
        </div>
      </div>
    `,
  };
};
// export const sendTicketEmail = async (userEmail: string, bookingData: any) => {
//   try {
//     let transporter;

//     // KIỂM TRA: Nếu không có cấu hình Gmail thì dùng Ethereal (Mock)
//     if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
//       console.log(
//         "⚠️  Phát hiện thiếu cấu hình Gmail. Đang tạo tài khoản Mock (Ethereal)...",
//       );
//       const testAccount = await nodemailer.createTestAccount();
//       transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false,
//         auth: {
//           user: testAccount.user,
//           pass: testAccount.pass,
//         },
//       });
//     } else {
//       // Dùng Gmail thật nếu đã cấu hình
//       transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.MAIL_USER,
//           pass: process.env.MAIL_PASS,
//         },
//       });
//     }

//     const qrDataUrl = await QRCode.toDataURL(bookingData._id.toString());

//     const htmlContent = `
//       <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto;">
//         <h2 style="color: #e50914; text-align: center;">VÉ XEM PHIM GIẢ LẬP (MOCK)</h2>
//         <p>Chào <b>${bookingData.ho_ten}</b>, đây là mail test!</p>
//         <hr>
//         <p>🎬 <b>Phim:</b> ${bookingData.movieName}</p>
//         <p>💺 <b>Ghế:</b> ${bookingData.seatCodes.join(", ")}</p>
//         <div style="text-align: center; margin-top: 20px;">
//           <img src="${qrDataUrl}" alt="QR Code" width="200"/>
//         </div>
//       </div>
//     `;

//     const info = await transporter.sendMail({
//       from: '"Cinema Mock" <project-cinema@example.com>',
//       to: userEmail,
//       subject: "Test vé xem phim",
//       html: htmlContent,
//     });

//     console.log("-----------------------------------------");
//     console.log("✅ Mail gửi thành công (Mock Mode)!");
//     // ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT:
//     console.log(
//       "🔗 Xem nội dung mail tại đây:",
//       nodemailer.getTestMessageUrl(info),
//     );
//     console.log("-----------------------------------------");
//   } catch (error) {
//     console.error("❌ Lỗi Mock Mail:", error);
//   }
// };
