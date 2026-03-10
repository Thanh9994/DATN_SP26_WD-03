import { AppError } from "@api/middlewares/error.middleware";
import { IUser } from "@shared/schemas";
import { Booking } from "../booking/booking.model";
import { bookingService } from "../booking/booking.service";
import { PaymentFactory } from "./gateways/payment.factory";

export const paymentService = {
  async initPayment(
    bookingId: string,
    method: string,
    ipAddr: string,
    user: IUser,
  ) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError("Đơn hàng không tồn tại", 404);

    // Check if the user owns the booking or is an admin
    if (booking.userId?.toString() !== user._id?.toString() && user.role !== "admin") {
      throw new AppError("Bạn không có quyền thanh toán cho đơn hàng này", 403);
    }

    if (booking.status !== "pending")
      throw new AppError("Đơn hàng đã xử lý hoặc hết hạn", 400);

    const amount = booking.finalAmount || booking.totalAmount;
    if (!amount || amount <= 0) {
      throw new AppError("Số tiền không hợp lệ", 400);
    }

    console.log(
      `💰 Creating payment for booking ${bookingId}, amount: ${amount}`,
    );

    const gateway = PaymentFactory.getGateway(method);
    return await gateway.createUrl(bookingId, amount, ipAddr);
  },

  async processIpn(method: string, data: any) {
    const gateway = PaymentFactory.getGateway(method);

    // Gateway trả về kết quả đã được chuẩn hóa (normalized)
    const result = await gateway.handleIpn(data);

    // Kiểm tra mã thành công chung (Ví dụ: '00' là thành công)
    if (result.code === "00" && result.orderId) {
      // Dùng result.orderId thay vì data.vnp_TxnRef để dùng chung cho mọi cổng
      await bookingService.confirmBooking(
        result.orderId,
        result.transactionNo || "N/A",
      );
    }

    return {
      code: result.code,
      message: result.message,
    };
  },
};
