import { Router } from "express";
import { createPaymentUrl, vnpayIpn } from "./payment.controller";

const paymentRouter = Router();

// Endpoint để client gọi khi nhấn "Thanh toán"
paymentRouter.post("/create-url", createPaymentUrl);

// Endpoint để Cổng thanh toán gọi callback (IPN)
paymentRouter.get("/vnpay-ipn", vnpayIpn);

export default paymentRouter;
