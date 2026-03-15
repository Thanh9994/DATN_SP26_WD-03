import { PaymentGateway } from "../interfaces/payment-gateway.interface";
import { MomoGateway } from "./momo.gateway";
import { VnpayGateway } from "./vnpay.gateway";
import { AppError } from "@api/middlewares/error.middleware";

export class PaymentFactory {
  private static gateways: Record<string, new () => PaymentGateway> = {
    vnpay: VnpayGateway,
    momo: MomoGateway,
  };

  static getGateway(method: string): PaymentGateway {
    const Gateway = this.gateways[method.toLowerCase()];

    if (!Gateway) {
      throw new AppError(
        `Phương thức thanh toán ${method} không được hỗ trợ`,
        400,
      );
    }

    return new Gateway();
  }
}
