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
    subject: 'Xac nhan da nhan ve thanh cong',
    html: `
      <div style="margin:0; padding:24px; background:#070b14; font-family:Arial, sans-serif;">
        <div style="max-width:620px; margin:0 auto; background:linear-gradient(180deg,#0f172a 0%, #111827 100%); border:1px solid #1f2937; border-radius:20px; overflow:hidden; color:#f3f4f6;">
          
          <div style="padding:28px 28px 18px; background:linear-gradient(90deg,#14532d 0%, #166534 100%);">
            <div style="font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#dcfce7; font-weight:700;">
              Cinema Ticket Pickup
            </div>
            <h2 style="margin:10px 0 0; font-size:28px; line-height:1.2; color:#ffffff;">
              Ve da duoc nhan thanh cong
            </h2>
            <p style="margin:10px 0 0; color:#dcfce7; font-size:14px; line-height:1.6;">
              Xin chao <b>${payload.customerName || 'Quy khach'}</b>, nhan vien rap da xac nhan ban da nhan ve thanh cong.
            </p>
          </div>

          <div style="padding:24px 28px;">
            <div style="margin-bottom:18px; padding:16px; border:1px solid #334155; border-radius:14px; background:#0b1220;">
              <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:2px; font-weight:700; margin-bottom:8px;">
                Ticket Code
              </div>
              <div style="font-size:24px; font-weight:800; color:#f87171; font-family:monospace; letter-spacing:1px;">
                ${payload.ticketCode || '---'}
              </div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0 12px;">
              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#111827; border:1px solid #1f2937; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; margin-bottom:6px;">
                      Phim
                    </div>
                    <div style="font-size:15px; color:#ffffff; font-weight:700;">
                      ${payload.movieName || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#111827; border:1px solid #1f2937; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; margin-bottom:6px;">
                      Ghe
                    </div>
                    <div style="font-size:15px; color:#ffffff; font-weight:700;">
                      ${(payload.seatCodes || []).join(', ') || '---'}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#111827; border:1px solid #1f2937; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; margin-bottom:6px;">
                      Ngay chieu
                    </div>
                    <div style="font-size:15px; color:#ffffff; font-weight:700;">
                      ${payload.showDate || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#111827; border:1px solid #1f2937; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; margin-bottom:6px;">
                      Gio chieu
                    </div>
                    <div style="font-size:15px; color:#ffffff; font-weight:700;">
                      ${payload.showTime || '---'}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#111827; border:1px solid #1f2937; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; margin-bottom:6px;">
                      Rap
                    </div>
                    <div style="font-size:15px; color:#ffffff; font-weight:700;">
                      ${payload.cinemaName || '---'}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#111827; border:1px solid #1f2937; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; margin-bottom:6px;">
                      Phong
                    </div>
                    <div style="font-size:15px; color:#ffffff; font-weight:700;">
                      ${payload.roomName || '---'}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="width:50%; vertical-align:top; padding-right:8px;">
                  <div style="background:#111827; border:1px solid #1f2937; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; margin-bottom:6px;">
                      Thoi gian nhan ve
                    </div>
                    <div style="font-size:15px; color:#22c55e; font-weight:700;">
                      ${pickedUpTime}
                    </div>
                  </div>
                </td>
                <td style="width:50%; vertical-align:top; padding-left:8px;">
                  <div style="background:#111827; border:1px solid #1f2937; border-radius:14px; padding:14px;">
                    <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px; font-weight:700; margin-bottom:6px;">
                      Trang thai
                    </div>
                    <div style="font-size:15px; color:#22c55e; font-weight:700;">
                      ${payload.status || 'Da nhan ve'}
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <div style="margin-top:20px; padding:14px 16px; background:#052e16; border:1px solid #166534; border-radius:14px;">
              <p style="margin:0; color:#dcfce7; font-size:13px; line-height:1.6;">
                Cam on ban da su dung dich vu cua he thong rap phim. Vui long luu lai email nay de doi chieu khi can.
              </p>
            </div>

            <p style="margin:18px 0 0; color:#94a3b8; font-size:12px; text-align:center;">
              Email tu dong tu he thong rap phim.
            </p>
          </div>
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
