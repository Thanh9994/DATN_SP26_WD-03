import { Router } from "express";
import productRouter from "./products/product.route";
import bookingRouter from "./booking/booking.route";

const oderRouter = Router();

oderRouter.use("/product", productRouter);
oderRouter.use("/booking", bookingRouter);
// oderRouter.use("");
// oderRouter.use("");
// oderRouter.use("");

export default oderRouter;
