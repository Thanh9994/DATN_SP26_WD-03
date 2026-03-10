import crypto from "crypto";
import qs from "qs";
import {
  IPaymentGateway,
  IPaymentResult,
} from "../interfaces/payment-gateway.interface";

import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";

export class VnpayGateway implements IPaymentGateway {
  async createUrl(
    bookingId: string,
    amount: number,
    ipAddr: string,
  ): Promise<string> {
    const vnpUrl = process.env.VNP_URL!;
    const secretKey = process.env.VNP_HASHSECRET!.trim();
    const tmnCode = "UPNPC0BW".trim();

    const date = new Date();
    const createDate = this.formatDate(date);

    let validIp = ipAddr;

    if (Array.isArray(validIp)) {
      validIp = validIp[0];
    }

    if (!validIp) validIp = "127.0.0.1";

    if (validIp.includes(",")) {
      validIp = validIp.split(",")[0];
    }

    if (validIp.includes("::ffff:")) {
      validIp = validIp.replace("::ffff:", "");
    }

    if (validIp === "::1") {
      validIp = "127.0.0.1";
    }
    const vnp_Params: any = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount * 100,
      vnp_CreateDate: createDate,
      vnp_CurrCode: "VND",
      vnp_IpAddr: validIp,
      vnp_Locale: "vn",
      vnp_OrderInfo: `thanhtoandonhang${bookingId}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: process.env.VNP_RETURNURL?.trim(),
      vnp_TxnRef: bookingId.toString(),
    };
    console.log("RETURN URL:", process.env.VNP_RETURNURL);

    // 1. Sắp xếp params
    const sorted = this.sortObject(vnp_Params);

    const signData = qs.stringify(sorted, { encode: false });

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    sorted["vnp_SecureHash"] = signed;

    const paymentUrl = `${vnpUrl}?${qs.stringify(sorted, { encode: false })}`;

    return paymentUrl;
  }

  async handleIpn(query: any): Promise<IPaymentResult> {
    const result = this._verify(query);

    // VNPAY yêu cầu trả về mã RspCode và Message
    if (result.code !== "00") {
      return {
        code: "97",
        message: "Invalid checksum",
      };
    }

    const isSuccess = query.vnp_ResponseCode === "00";
    return {
      code: isSuccess ? "00" : query.vnp_ResponseCode || "01",
      message: isSuccess ? "Success" : "Payment Failed",
      orderId: query.vnp_TxnRef,
      transactionNo: query.vnp_TransactionNo,
    };
  }

  verifyReturn(query: any): IPaymentResult {
    const result = this._verify(query);
    const isSuccess = query.vnp_ResponseCode === "00" && result.code === "00";

    return {
      code: isSuccess ? "00" : query.vnp_ResponseCode || "97",
      message: result.message,
      orderId: query.vnp_TxnRef,
      transactionNo: query.vnp_TransactionNo,
    };
  }

  private _verify(query: any): { code: string; message: string } {
    const secretKey = process.env.VNP_HASHSECRET!.trim();
    const vnp_SecureHash = query["vnp_SecureHash"];

    const data = { ...query };
    delete data["vnp_SecureHash"];
    delete data["vnp_SecureHashType"];

    const sortedParams = this.sortObject(data);

    // SỬA LỖI: Dùng đúng qs.stringify như lúc tạo URL
    const signData = qs.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (vnp_SecureHash !== signed) {
      console.log("❌ Chữ ký không khớp!");
      console.log("Dữ liệu để băm:", sortedParams);
      console.log("Chuỗi bạn vừa băm:", signData);
      console.log("Mã băm của bạn:", signed);
      console.log("Mã băm VNPay gửi về:", vnp_SecureHash);
      return { code: "97", message: "Invalid checksum" };
    }

    return { code: "00", message: "Success" };
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
