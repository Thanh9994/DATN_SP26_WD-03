import { IPaymentGateway } from "../interfaces/payment-gateway.interface";
import { VnpayGateway } from "./vnpay.gateway";
import { AppError } from "@api/middlewares/error.middleware";

export class PaymentFactory {
  static getGateway(method: string): IPaymentGateway {
    switch (method.toLowerCase()) {
      case "vnpay":
        return new VnpayGateway();
      // Sau này thêm Momo:
      // case "momo": return new MomoGateway();
      default:
        throw new AppError(
          `Phương thức thanh toán ${method} không được hỗ trợ`,
          400,
        );
    }
  }
}
