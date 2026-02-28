import { Router } from "express";
import productRouter from "./products/product.route";

const oderRouter = Router()

oderRouter.use("/product", productRouter);
// oderRouter.use("");
// oderRouter.use("");
// oderRouter.use("");

export default oderRouter;