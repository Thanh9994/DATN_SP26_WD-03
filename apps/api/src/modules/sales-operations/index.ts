import { Router } from "express";
import productRouter from "./products/product.route";
import bookingRouter from "./booking/booking.route";

const orderRouter = Router();

orderRouter.use("/product", productRouter);
orderRouter.use("/booking", bookingRouter);

export default orderRouter;
