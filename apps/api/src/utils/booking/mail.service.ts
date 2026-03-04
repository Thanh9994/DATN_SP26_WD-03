// import nodemailer from "nodemailer";
// import QRCode from "qrcode";

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
