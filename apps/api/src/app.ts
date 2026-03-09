import express from "express";
import morgan from "morgan";
import cors from "cors";
import uploadRouter from "./middlewares/upload";
import catalogRouter from "./modules/cinema-catalog";
import accessRouter from "./modules/access-control";
import contentRouter from "./modules/movie-content";
import testRoute from "./modules/test/test.route";
import orderRouter from "./modules/sales-operations";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/test", testRoute);
app.use("/api/uploads", uploadRouter);
app.use("/api/order", orderRouter);
app.use("/api/access", accessRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/content", contentRouter);
app.use(globalErrorHandler);
export default app;
