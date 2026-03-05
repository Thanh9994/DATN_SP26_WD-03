import { catchAsync } from "@api/utils/catchAsync";
import { Request, Response } from "express";
import { paymentService } from "./payment.service";

// 1. Tạo URL thanh toán (Dùng chung cho VNPay, Momo, ZaloPay...)
export const createPaymentUrl = catchAsync(
  async (req: Request, res: Response) => {
    // Nhận thêm 'method' (phương thức) từ body hoặc params
    const { bookingId } = req.body;
    const { method } = req.params;

    const ipAddr =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

    // Truyền 'method' vào service để nó tự chọn Gateway tương ứng
    const paymentUrl = await paymentService.initPayment(
      bookingId,
      method,
      ipAddr as string,
    );

    res.status(200).json({
      success: true,
      data: paymentUrl,
    });
  },
);

// 2. Xử lý IPN (Webhook chung cho mọi cổng)
export const handlePaymentIpn = catchAsync(
  async (req: Request, res: Response) => {
    const { method } = req.params;

    // Service sẽ tự biết gọi Gateway nào để kiểm tra chữ ký (Checksum)
    const result = await paymentService.processIpn(method, {
      ...req.query,
      ...req.body,
    });

    // Trả về kết quả theo yêu cầu của cổng đó
    // Ví dụ VNPay cần { RspCode, Message }
    res.status(200).json(result);
  },
);
