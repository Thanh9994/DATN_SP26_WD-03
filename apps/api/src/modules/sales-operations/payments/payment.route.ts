// payment.route.ts
import { Router } from "express";
import * as PaymentController from "./payment.controller";
import { authenticate } from "@api/middlewares/auth.middleware";

const paymentRouter = Router();

// Khách gọi để lấy link thanh toán
paymentRouter.post(
  "/:method/create",
  authenticate,
  PaymentController.createPaymentUrl,
);

// VNPay/Momo gọi về để báo kết quả
paymentRouter.get("/:method/ipn", PaymentController.handlePaymentIpn);

paymentRouter.get("/:method/return", PaymentController.handlePaymentReturn);

export default paymentRouter;
