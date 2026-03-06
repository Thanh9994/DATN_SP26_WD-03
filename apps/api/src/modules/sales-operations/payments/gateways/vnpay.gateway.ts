import crypto from "crypto";
import qs from "qs";
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

export class VnpayGateway implements IPaymentGateway {
  async createUrl(
    bookingId: string,
    amount: number,
    ipAddr: string,
  ): Promise<string> {
    const vnpUrl = process.env.VNP_URL!;
    const tmnCode = process.env.VNP_TMNCODE!;
    const secretKey = process.env.VNP_HASHSECRET!;
    const returnUrl = process.env.VNP_RETURNURL!;

    // fix IPv6 localhost
    if (ipAddr === "::1") {
      ipAddr = "127.0.0.1";
    }

    let vnp_Params: any = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",

      vnp_TxnRef: bookingId,

      vnp_OrderInfo: `Thanh toan ve xem phim ${bookingId}`,
      vnp_OrderType: "other",

      // VNPay yêu cầu *100
      vnp_Amount: amount * 100,

      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,

      vnp_CreateDate: this.formatDate(new Date()),
    };

    vnp_Params = this.sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });

    const hmac = crypto.createHmac("sha512", secretKey);

    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const paymentUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${signed}`;

    return paymentUrl;
  }

  async handleIpn(query: any) {
    const secretKey = process.env.VNP_HASHSECRET!;

    const secureHash = query.vnp_SecureHash;

    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const sortedParams = this.sortObject(query);

    const signData = qs.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac("sha512", secretKey);

    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Verify checksum
    if (secureHash !== signed) {
      return {
        code: "97",
        message: "Invalid checksum",
      };
    }

    const isSuccess = query.vnp_ResponseCode === "00";

    return {
      code: isSuccess ? "00" : "01",
      message: isSuccess ? "Success" : "Payment Failed",
      bookingId: query.vnp_TxnRef,
      transactionNo: query.vnp_TransactionNo,
    };
  }

  private sortObject(obj: any) {
    let sorted: any = {};

    let keys = Object.keys(obj)
      .map((key) => encodeURIComponent(key))
      .sort();

    keys.forEach((key) => {
      sorted[key] = encodeURIComponent(obj[decodeURIComponent(key)]).replace(
        /%20/g,
        "+",
      );
    });

    return sorted;
  }

  private formatDate(date: Date) {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    return (
      date.getFullYear() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }
}
