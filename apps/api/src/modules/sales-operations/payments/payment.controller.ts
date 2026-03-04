import { Request, Response } from "express";
import { paymentService } from "./payment.service";

export const createPaymentUrl = async (req: Request, res: Response) => {
  try {
    const { bookingId, bankCode } = req.body;
    // bankCode có thể là 'VNPAYQR', 'VNBANK', v.v.

    const paymentUrl = await paymentService.generatePaymentUrl(
      bookingId,
      bankCode,
      req,
    );

    return res.json({ paymentUrl });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const vnpayIpn = async (req: Request, res: Response) => {
  try {
    // VNPay sẽ gọi vào đây để thông báo kết quả thanh toán ngầm (Server-to-Server)
    const result = await paymentService.handleVnpayCallback(req.query);

    // Theo tài liệu VNPay, phải trả về format JSON cụ thể này
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ RspCode: "99", Message: "Unknow error" });
  }
};
