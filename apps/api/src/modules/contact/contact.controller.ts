import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const sendContactMail = async (req: Request, res: Response) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        message: "Thiếu cấu hình EMAIL_USER hoặc EMAIL_PASS",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${fullName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:24px;">
          <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:24px;">
            <h2 style="margin-top:0;color:#111;">Liên hệ mới từ website</h2>
            <p><strong>Họ tên:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Tiêu đề:</strong> ${subject}</p>
            <p><strong>Nội dung:</strong></p>
            <div style="padding:12px;background:#f9fafb;border-radius:8px;white-space:pre-line;">
              ${message}
            </div>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      message: "Gửi liên hệ thành công",
    });
  } catch (error) {
    console.error("sendContactMail error:", error);
    return res.status(500).json({
      message: "Không thể gửi email",
    });
  }
};