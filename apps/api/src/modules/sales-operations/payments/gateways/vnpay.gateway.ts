import crypto from "crypto";
import qs from "qs";
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

export class VnpayGateway implements IPaymentGateway {
  async createUrl(
    bookingId: string,
    amount: number,
    ipAddr: string,
  ): Promise<string> {
    const secretKey = process.env.VNP_HASHSECRET!;
    let vnp_Params: any = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: process.env.VNP_TMNCODE,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: bookingId,
      vnp_OrderInfo: `Thanh toan ve xem phim ${bookingId}`,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: process.env.VNP_RETURNURL,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: this.formatDate(new Date()),
    };

    vnp_Params = this.sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return `${process.env.VNP_URL}?${signData}&vnp_SecureHash=${signed}`;
  }

  async handleIpn(query: any) {
    // Logic kiểm tra checksum SHA512 ở đây (như file cũ của bạn)
    // Nếu thành công:
    return {
      code: query.vnp_ResponseCode === "00" ? "00" : "01",
      message: query.vnp_ResponseCode === "00" ? "Success" : "Fail",
      bookingId: query.vnp_TxnRef, // Trả về ID để Service dùng chung
      transactionNo: query.vnp_TransactionNo, // Trả về mã GD để lưu DB
    };
  }

  private sortObject(obj: any) {
    let sorted: any = {};
    let str = Object.keys(obj)
      .map((key) => encodeURIComponent(key))
      .sort();
    str.forEach((key) => {
      sorted[key] = encodeURIComponent(obj[decodeURIComponent(key)]).replace(
        /%20/g,
        "+",
      );
    });
    return sorted;
  }

  private formatDate(date: Date) {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }
}
