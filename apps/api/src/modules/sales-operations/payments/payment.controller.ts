import { catchAsync } from "@api/utils/catchAsync";
import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { PaymentFactory } from "./gateways/payment.factory";
import { bookingService } from "../booking/booking.service";

// 1. Tạo URL thanh toán (Dùng chung cho VNPay, Momo, ZaloPay...)
export const createPaymentUrl = catchAsync(
  async (req: Request, res: Response) => {
    // Nhận thêm 'method' (phương thức) từ body hoặc params
    const { bookingId } = req.body;
    const { method } = req.params;
    const user = req.user!;

    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress ||
      "127.0.0.1";

    // Truyền 'method' vào service để nó tự chọn Gateway tương ứng
    const paymentUrl = await paymentService.initPayment(
      bookingId,
      method,
      ipAddr as string,
      user,
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
    console.log("-----------------------------------------");
    console.log("🚀 NHẬN TÍN HIỆU TỪ VNPAY!");
    console.log("Method:", req.params.method);
    console.log("Dữ liệu Query:", req.query);
    console.log("-----------------------------------------");
    const { method } = req.params;
    const result = await paymentService.processIpn(method, {
      ...req.query,
      ...req.body,
    });

    if (method === "vnpay") {
      return res.status(200).json({
        RspCode: result.code === "00" ? "00" : "97",
        Message: result.message,
      });
    }

    // Trả về kết quả theo yêu cầu của cổng đó
    // Ví dụ VNPay cần { RspCode, Message }
    res.status(200).json(result);
  },
);

// 3. Xử lý khi khách hàng quay về từ cổng thanh toán
export const handlePaymentReturn = catchAsync(
  async (req: Request, res: Response) => {
    const { method } = req.params;

    // 1. Lấy gateway
    const gateway = PaymentFactory.getGateway(method);

    // 2. Xác thực chữ ký và lấy kết quả
    // verifyReturn sẽ tự xử lý chữ ký và trả về kết quả chuẩn hóa
    const result = gateway.verifyReturn(req.query);

    // 3. Chuyển hướng về frontend với kết quả
    // Frontend sẽ dựa vào `code` và `bookingId` để hiển thị thông báo phù hợp
    // và gọi API để lấy trạng thái cuối cùng của đơn hàng (đã được IPN cập nhật)
    const frontendUrl = new URL(
      process.env.VNP_RETURNURL || "http://localhost:5173/payment-return",
    );
    frontendUrl.searchParams.set("bookingId", result.orderId || "");
    frontendUrl.searchParams.set("code", result.code);
    frontendUrl.searchParams.set("transactionNo", result.transactionNo || "");

    return res.redirect(frontendUrl.toString());
  },
);
