import { Request, Response } from "express";
import * as MailService from "@api/common/mail.service";

export const sendContactMail = async (req: Request, res: Response) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    await MailService.sendContactMailToAdmin({
      fullName,
      email,
      subject,
      message,
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