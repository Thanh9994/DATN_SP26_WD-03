import { PaymentGateway } from "../interfaces/payment-gateway.interface";

import {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
  HashAlgorithm,
} from "vnpay";

const generatePayID = () => {
  const now = new Date();
  const timestamp = now.getTime();
  const second = now.getSeconds().toString().padStart(2, "0");
  const millisecond = now.getMilliseconds().toString().padStart(3, "0");
  return `PAY.  ${timestamp}.${second}.${millisecond}`;
};

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE as string,
  secureSecret: process.env.VNP_HASH_SECRET as string,
  vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  testMode: true, // Chế độ test
  hashAlgorithm: HashAlgorithm.SHA512,
  loggerFn: ignoreLogger,
});

export class VnpayGateway implements PaymentGateway {
  async createUrl(
    bookingId: string,
    amount: number,
    ipAddr: string,
  ): Promise<string> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: bookingId,
      vnp_OrderInfo: `Payments ${bookingId} - ${generatePayID()}`,
      vnp_OrderType: ProductCode.Other,
      // vnp_ReturnUrl: process.env.VNP_RETURNURL as string,
      vnp_ReturnUrl: "http://localhost:5000/payments/vnpay/return",
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
      vnp_ExpireDate: dateFormat(tomorrow),
    });
    console.log(paymentUrl);
    return paymentUrl;
  }

  async handleIpn(query: any) {
    const result = vnpay.verifyIpnCall(query);

    return {
      code: result.isSuccess && result.vnp_ResponseCode === "00" ? "00" : "97",
      message: result.message,
      bookingId: query.vnp_TxnRef,
      transactionNo: query.vnp_TransactionNo,
    };
  }

  verifyReturn(query: any) {
    const result = vnpay.verifyReturnUrl(query);

    return {
      code: result.isVerified && result.vnp_ResponseCode === "00" ? "00" : "97",
      bookingId: query.vnp_TxnRef,
      transactionNo: query.vnp_TransactionNo,
    };
  }
}
