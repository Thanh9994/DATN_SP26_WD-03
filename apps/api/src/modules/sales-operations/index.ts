import { Router } from "express";
import productRouter from "./products/product.route";
import bookingRouter from "./booking/booking.route";
import { getDashboardStats } from "./booking/booking.controller";

const orderRouter = Router();

orderRouter.use("/product", productRouter);
orderRouter.use("/booking", bookingRouter);
orderRouter.get("/analytics/dashboard", getDashboardStats);
// oderRouter.use("");
// oderRouter.use("");
// oderRouter.use("");

export default orderRouter;
