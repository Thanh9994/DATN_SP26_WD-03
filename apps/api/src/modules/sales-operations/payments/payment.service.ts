import { AppError } from "@api/middlewares/error.middleware";
import { IUser } from "@shared/schemas";
import { Booking } from "../booking/booking.model";
import { bookingService } from "../booking/booking.service";
import { PaymentFactory } from "./gateways/payment.factory";
import { Payment } from "./payment.model";

export const paymentService = {
  async initPayment(
    bookingId: string,
    method: string,
    ipAddr: string,
    user: IUser,
  ) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new AppError("Đơn hàng không tồn tại", 404);
    }

    // check quyền
    if (
      booking.userId?.toString() !== user._id?.toString() &&
      user.role !== "admin"
    ) {
      throw new AppError("Bạn không có quyền thanh toán đơn hàng này", 403);
    }

    // check trạng thái booking
    if (booking.status !== "pending") {
      throw new AppError("Đơn hàng đã xử lý hoặc hết hạn", 400);
    }

    const amount = booking.finalAmount || booking.totalAmount;

    if (!amount || amount <= 0) {
      throw new AppError("Số tiền không hợp lệ", 400);
    }

    console.log(
      `💰 Creating payment for booking ${bookingId}, amount: ${amount}`,
    );

    // tạo record payment
    const payment = await Payment.create({
      bookingId: booking._id,
      userId: user._id,
      finalAmount: amount,
      paymentMethod: method,
      status: "pending",
    });

    // lấy gateway
    let gateway;

    try {
      gateway = PaymentFactory.getGateway(method);
    } catch {
      throw new AppError("Phương thức thanh toán không được hỗ trợ", 400);
    }

    // tạo url thanh toán
    const paymentUrl = await gateway.createUrl(
      payment._id.toString(),
      amount,
      ipAddr,
    );

    return paymentUrl;
  },

  // Xử lý IPN từ gateway

  async processIpn(method: string, data: any) {
    try {
      const gateway = PaymentFactory.getGateway(method);

      const result = await gateway.handleIpn(data);

      if (!result.bookingId) {
        return {
          code: "97",
          message: "Thiếu bookingId",
        };
      }

      const payment = await Payment.findOne({ bookingId: result.bookingId });

      if (!payment) {
        return {
          code: "01",
          message: "Payment không tồn tại",
        };
      }

      const amount = Number(data.vnp_Amount) / 100;

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

        await payment.save();

        await bookingService.confirmBooking(
          payment.bookingId.toString(),
          result.transactionNo || "N/A",
        );
      } else {
        payment.status = "failed";
        payment.gatewayDataResponse = data;

        await payment.save();
        await bookingService.cancelBooking(
          payment.bookingId.toString(),
          payment.userId.toString(),
        );
      }
      return {
        code: result.code,
        message: result.message,
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
