import axios from "axios";
import crypto from "crypto";
import { PaymentGateway } from "../interfaces/payment-gateway.interface";

const generatePayID = () => {
  const now = new Date();
  const timestamp = now.getTime();
  const second = now.getSeconds().toString().padStart(2, "0");
  const millisecond = now.getMilliseconds().toString().padStart(3, "0");

  return `PAY.${timestamp}.${second}.${millisecond}`;
};

export class MomoGateway implements PaymentGateway {
  async createUrl(
    paymentId: string,
    amount: number,
    ipAddr: string,
  ): Promise<string> {
    void ipAddr;

    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const partnerCode = "MOMO";

    const orderId = `${paymentId}_${crypto.randomUUID()}`;
    const requestId = orderId;

    const orderInfo = `Thanh toán đặt vé xem phim ${paymentId} - ${generatePayID()}`;

    const redirectUrl = "http://localhost:5000/payments/momo/return";
    const ipnUrl = "http://localhost:5000/payments/momo/ipn";

    const requestType = "payWithMethod";

    const amountText = Math.round(amount).toString();
    const extraData = "";

    // string ký
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amountText}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount: amountText,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      requestType,
      extraData,
      lang: "vi",
      autoCapture: true,
      signature,
    };

    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
    );

    return response.data.payUrl;
  }

  async handleIpn(data: any) {
    const isSuccess = Number(data.resultCode) === 0;

    const paymentId = data.orderId.split("_")[0];

    return {
      code: isSuccess ? "00" : data.resultCode.toString(),
      message: isSuccess
        ? "Thanh toán thành công"
        : data.message || "Thanh toán thất bại",
      paymentId,
      transactionNo: data.transId ? String(data.transId) : undefined,
    };
  }

  verifyReturn(data: any) {
    const isSuccess = Number(data.resultCode) === 0;

    const paymentId = data.orderId.split("_")[0];

    return {
      code: isSuccess ? "00" : data.resultCode.toString(),
      message: isSuccess
        ? "Thanh toán thành công"
        : data.message || "Thanh toán thất bại",
      paymentId,
      transactionNo: data.transId ? String(data.transId) : undefined,
    };
  }

  private verifySignature(data: any): boolean {
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

    const rawSignature =
      `accessKey=${data.accessKey}` +
      `&amount=${data.amount}` +
      `&extraData=${data.extraData}` +
      `&message=${data.message}` +
      `&orderId=${data.orderId}` +
      `&orderInfo=${data.orderInfo}` +
      `&orderType=${data.orderType}` +
      `&partnerCode=${data.partnerCode}` +
      `&payType=${data.payType}` +
      `&requestId=${data.requestId}` +
      `&responseTime=${data.responseTime}` +
      `&resultCode=${data.resultCode}` +
      `&transId=${data.transId}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    return signature === data.signature;
  }
}
