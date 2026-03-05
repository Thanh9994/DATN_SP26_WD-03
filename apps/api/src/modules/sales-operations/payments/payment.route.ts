// payment.route.ts
import { Router } from "express";
import * as PaymentController from "./payment.controller";

const paymentRouter = Router();

// Khách gọi để lấy link thanh toán
paymentRouter.post("/:method/create", PaymentController.createPaymentUrl);

// VNPay/Momo gọi về để báo kết quả
paymentRouter.all("/:method/ipn", PaymentController.handlePaymentIpn);

paymentRouter.post("/vnpay/create");

export default paymentRouter;
