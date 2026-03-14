import { AppError } from "@api/middlewares/error.middleware";
import { IUser } from "@shared/schemas";
import { Booking } from "../booking/booking.model";
import { bookingService } from "../booking/booking.service";
import { PaymentFactory } from "./gateways/payment.factory";
import { Payment } from "./payment.model";

export const paymentService = {
  async initPayment(
    bookingId: string,
    holdToken: string,
    method: string,
    ipAddr: string,
    user: IUser,
  ) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }
    if (booking.holdToken !== holdToken) {
      throw new AppError("Token giữ ghế không hợp lệ", 403);
    }
    // check quyền
    if (
      booking.userId?.toString() !== user._id?.toString() &&
      user.role !== "admin"
    ) {
      throw new AppError("Bạn không có quyền thanh toán đơn hàng này", 404);
    }

    // check trạng thái booking
    if (booking.status !== "pending") {
      throw new AppError("Đơn hàng đã xử lý hoặc hết hạn", 400);
    }
    if (booking.holdExpiresAt && booking.holdExpiresAt < new Date()) {
      booking.status = "expired";
      await booking.save();

      throw new AppError("Ghế đã hết thời gian giữ", 400);
    }
    const amount = booking.finalAmount || booking.totalAmount;

    if (!amount || amount <= 0) {
      throw new AppError("Số tiền không hợp lệ", 400);
    }

    console.log(
      `💰 Creating payment for booking ${bookingId}, amount: ${amount}`,
    );

    const existedPayment = await Payment.findOne({
      bookingId,
      status: { $in: ["pending", "paying"] },
      paymentMethod: method,
      // createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
    });

    if (existedPayment && existedPayment.paymentUrl) {
      return existedPayment.paymentUrl;
    }

    // tạo record payment
    const payment = await Payment.create({
      bookingId: booking._id,
      userId: booking.userId,
      finalAmount: amount,
      paymentMethod: method,
      status: "paying",
    });

    let gateway;

    try {
      gateway = PaymentFactory.getGateway(method);
    } catch {
      throw new AppError("Phương thức thanh toán không được hỗ trợ", 400);
    }

    const paymentUrl = await gateway.createUrl(
      payment._id.toString(),
      amount,
      ipAddr,
    );

    payment.paymentUrl = paymentUrl;
    await payment.save();

    return paymentUrl;
  },

  // Xử lý IPN từ gateway

  async processIpn(method: string, data: any) {
    try {
      const gateway = PaymentFactory.getGateway(method);

      const result =
        data.vnp_SecureHashType || data.vnp_SecureHash
          ? gateway.verifyReturn(data)
          : await gateway.handleIpn(data);

      if (!result.paymentId) {
        return {
          code: "97",
          message: "Thiếu paymentId",
        };
      }

      const payment = await Payment.findById(result.paymentId);

      if (!payment) {
        return {
          code: "01",
          message: "Payment không tồn tại",
        };
      }

      const amount =
        method === "vnpay"
          ? Number(data.vnp_Amount) / 100
          : Number(data.amount || 0);

      if (amount !== payment.finalAmount) {
        return {
          code: "04",
          message: "Sai số tiền thanh toán",
        };
      }

      // chống xử lý nhiều lần
      if (payment.status === "success") {
        return {
          code: "00",
          message: "Payment already processed",
        };
      }

      if (result.code === "00") {
        payment.status = "success";
        payment.transactionNo = result.transactionNo;
        payment.gatewayDataResponse = data;

        await bookingService.confirmBooking(
          payment.bookingId.toString(),
          result.transactionNo || "N/A",
          payment.userId.toString(),
        );
      } else {
        payment.status = "failed";
        payment.gatewayDataResponse = data;

        await bookingService.cancelBooking(
          payment.bookingId.toString(),
          payment.userId.toString(),
        );
      }
      console.log("VNPay result:", result);
      console.log("Found payment:", payment);
      await payment.save();
      return {
        code: result.code,
        paymentId: result.paymentId,
        transactionNo: result.transactionNo,
      };
    } catch (error) {
      console.error("IPN PROCESS ERROR:", error);
      return {
        code: "99",
        message: "Lỗi Thất bại",
      };
    }
  },
};
