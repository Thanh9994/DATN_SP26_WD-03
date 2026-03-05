import { Booking } from "../booking/booking.model";
import { bookingService } from "../booking/booking.service";
import { PaymentFactory } from "./gateways/payment.factory";
import { AppError } from "@api/middlewares/error.middleware";

export const paymentService = {
  async initPayment(bookingId: string, method: string, ipAddr: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError("Đơn hàng không tồn tại", 404);
    if (booking.status !== "pending")
      throw new AppError("Đơn hàng đã xử lý hoặc hết hạn", 400);

    // Factory sẽ trả về class Gateway tương ứng (VNPay, Momo, v.v.)
    const gateway = PaymentFactory.getGateway(method);
    return await gateway.createUrl(bookingId, booking.finalAmount, ipAddr);
  },

  async processIpn(method: string, data: any) {
    const gateway = PaymentFactory.getGateway(method);

    // Gateway trả về kết quả đã được chuẩn hóa (normalized)
    const result = await gateway.handleIpn(data);

    // Kiểm tra mã thành công chung (Ví dụ: '00' là thành công)
    if (result.code === "00" && result.bookingId) {
      // Dùng result.bookingId thay vì data.vnp_TxnRef để dùng chung cho mọi cổng
      await bookingService.confirmBooking(
        result.bookingId,
        result.transactionNo || "N/A",
      );
    }

    return {
      code: result.code,
      message: result.message,
    };
  },
};
