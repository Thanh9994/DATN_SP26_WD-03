import { Booking } from "../booking/booking.model";
import { bookingService } from "../booking/booking.service";
import { Request } from "express";

export const paymentService = {
  async generatePaymentUrl(bookingId: string, bankCode: string, req: Request) {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== "pending") {
      throw new Error("Đơn hàng không hợp lệ hoặc đã hết hạn.");
    }

    // Kiểm tra thời gian giữ ghế còn hiệu lực không
    if (new Date() > booking.holdExpiresAt) {
      throw new Error("Thời gian giữ ghế đã hết. Vui lòng đặt lại.");
    }

    // Logic giả lập gọi VNPay (Bạn cần cài thêm thư viện vnpay hoặc tự viết hash)
    // Ở đây mình trả về một URL giả định để bạn hình dung flow
    const amount = booking.finalAmount;
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    // Bạn sẽ thực hiện logic buildQuery và tạo mã Hash tại đây...
    const paymentUrl = `${vnpUrl}?vnp_Amount=${amount * 100}&vnp_TxnRef=${bookingId}...`;

    return paymentUrl;
  },

  async handleVnpayCallback(vnpayData: any) {
    /* Giả sử vnpayData chứa:
       vnp_ResponseCode: "00" (Thành công)
       vnp_TxnRef: Chính là bookingId chúng ta gửi đi
       vnp_TransactionNo: Mã giao dịch của VNPay
    */

    const bookingId = vnpayData.vnp_TxnRef;
    const responseCode = vnpayData.vnp_ResponseCode;
    const transactionNo = vnpayData.vnp_TransactionNo;

    if (responseCode === "00") {
      // Gọi hàm confirmBooking bạn đã viết sẵn trong bookingService
      // Hàm này đã có Transaction để đảm bảo tính toàn vẹn của Ghế và Booking
      await bookingService.confirmBooking(bookingId, transactionNo);

      return { RspCode: "00", Message: "Confirm Success" };
    } else {
      // Nếu thanh toán thất bại, bạn có thể để Cronjob tự hủy hoặc hủy luôn tại đây
      return { RspCode: "01", Message: "Payment Failed" };
    }
  },
};
