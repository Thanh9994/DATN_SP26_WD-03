import express from "express";
import cors from "cors";
import uploadRouter from "./middlewares/upload";
import productRouter from "./modules/sales-operations/products/product.route";
import catalogRouter from "./modules/cinema-catalog";
import accessRouter from "./modules/access-control";
import contentRouter from "./modules/movie-content";
import testRoute from "./modules/test/test.route";

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/test", testRoute);
app.use("/api/uploads", uploadRouter);
app.use("/api/product", productRouter);
app.use("/api/access", accessRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/content", contentRouter);

export default app;
