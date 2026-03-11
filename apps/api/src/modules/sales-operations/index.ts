import { Router } from "express";
import productRouter from "./products/product.route";
import bookingRouter from "./booking/booking.route";
import paymentRouter from "./payments/payment.route";

const orderRouter = Router();

orderRouter.use("/product", productRouter);
orderRouter.use("/booking", bookingRouter);
orderRouter.use("/v1/payments", paymentRouter);

export default orderRouter;
