import { catchAsync } from "@api/utils/catchAsync";
import { Request, Response } from "express";
// import { paymentService } from "./payment.service";
import { PaymentFactory } from "./gateways/payment.factory";
import { bookingService } from "../booking/booking.service";
import { Payment } from "./payment.model";
import { paymentService } from "./payment.service";

export const createPaymentUrl = catchAsync(
  async (req: Request, res: Response) => {
    const { bookingId } = req.body;
    const { method } = req.params;

    const user = req.user!;

    const ipAddr =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    const paymentUrl = await paymentService.initPayment(
      bookingId,
      method,
      ipAddr,
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
    console.log("------------------------------------------------");
    console.log("🚀 PAYMENT IPN RECEIVED");
    console.log("Method:", req.params.method);
    console.log("Query:", req.query);
    console.log("------------------------------------------------");

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

    res.status(200).json(result);
  },
);

// 3. Xử lý khi khách hàng quay về từ cổng thanh toán
export const handlePaymentReturn = catchAsync(
  async (req: Request, res: Response) => {
    const { method } = req.params;

    const gateway = PaymentFactory.getGateway(method);

    // verify chữ ký
    const result = gateway.verifyReturn(req.query);

    console.log("🔁 PAYMENT RETURN:", result);

    const payment = await Payment.findById(result.paymentId);
    if (payment) {
      payment.gatewayDataResponse = req.query;

      if (result.code === "00") {
        payment.status = "success";
        payment.transactionNo = result.transactionNo;

        await bookingService.confirmBooking(
          payment.bookingId.toString(),
          payment._id.toString(),
          payment.userId.toString(),
        );
      } else {
        payment.status = "failed";

        // hủy giữ ghế
        await bookingService.cancelBooking(
          payment.bookingId.toString(),
          payment.userId.toString(),
        );
      }
      await payment.save();
    }
    // nếu thanh toán thành công

    const frontendUrl = new URL(
      process.env.FRONTEND_URL || "http://localhost:5173",
    );

    frontendUrl.pathname = "/payment-result";
    frontendUrl.searchParams.set("code", result.code || "97");
    frontendUrl.searchParams.set("transactionNo", result.transactionNo || "");

    return res.redirect(frontendUrl.toString());
  },
);
