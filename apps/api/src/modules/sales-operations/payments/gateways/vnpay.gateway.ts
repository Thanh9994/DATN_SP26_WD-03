import crypto from "crypto";
import qs from "qs";
import {
  IPaymentGateway,
  IPaymentResult,
} from "../interfaces/payment-gateway.interface";

export class VnpayGateway implements IPaymentGateway {
  async createUrl(
    bookingId: string,
    amount: number,
    ipAddr: string,
  ): Promise<string> {
    const vnpUrl = process.env.VNP_URL!;
    const secretKey = process.env.VNP_HASHSECRET!.trim();
    const tmnCode = "UPNPC0BW".trim(); //

    const date = new Date();
    const createDate = this.formatDate(date);

    let validIp = ipAddr || "127.0.0.1";
    if (validIp.includes("::ffff:")) validIp = validIp.replace("::ffff:", "");
    if (validIp === "::1") validIp = "127.0.0.1";

    const vnp_Params: any = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: Math.floor(amount * 100),
      vnp_CreateDate: createDate,
      vnp_CurrCode: "VND",
      vnp_IpAddr: validIp,
      vnp_Locale: "vn",
      vnp_OrderInfo: `thanhtoandonhang${bookingId}`.trim(),
      vnp_OrderType: "other",
      vnp_ReturnUrl: process.env.VNP_RETURNURL?.trim(),
      vnp_TxnRef: bookingId,
    };

    // 1. Sắp xếp params
    const sorted = this.sortObject(vnp_Params);

    // 2. Tạo chuỗi băm sử dụng encodeURIComponent để khớp với VNPay
    const signData = Object.keys(sorted)
      .map((key) => {
        // Encode key và value theo chuẩn RFC3986
        return `${encodeURIComponent(key)}=${encodeURIComponent(sorted[key]).replace(/%20/g, "+")}`;
      })
      .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // 3. Tạo URL cuối cùng
    const queryParams = Object.keys(sorted)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(sorted[key]).replace(/%20/g, "+")}`,
      )
      .join("&");

    const finalUrl = `${vnpUrl}?${queryParams}&vnp_SecureHash=${signed}`;

    return finalUrl;
  }

  async handleIpn(query: any): Promise<IPaymentResult> {
    const secretKey = process.env.VNP_HASHSECRET!;
    const secureHash = query.vnp_SecureHash;

    const data = { ...query };
    delete data.vnp_SecureHash;
    delete data.vnp_SecureHashType;

    const sortedParams = this.sortObject(data);
    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return { code: "97", message: "Invalid checksum" };
    }

    const isSuccess = query.vnp_ResponseCode === "00";
    return {
      code: isSuccess ? "00" : query.vnp_ResponseCode || "01",
      message: isSuccess ? "Success" : "Payment Failed",
      bookingId: query.vnp_TxnRef,
      transactionNo: query.vnp_TransactionNo,
    };
  }

  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
        sorted[key] = obj[key].toString();
      }
    });
    return sorted;
  }

  private formatDate(date: Date) {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }
}
