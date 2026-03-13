import express from "express";
import morgan from "morgan";
import cors from "cors";
import uploadRouter from "./middlewares/upload";
import catalogRouter from "./modules/cinema-catalog";
import accessRouter from "./modules/access-control";
import contentRouter from "./modules/movie-content";
import orderRouter from "./modules/sales-operations";
import { globalErrorHandler } from "./middlewares/error.middleware";
import paymentRouter from "./modules/sales-operations/payments/payment.route";
import chatbotRoute from "./modules/chatbot/chatbot.route";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import compression from "compression";

const app = express();
app.set("etag", false);
app.use(compression());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms"),
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const api = express.Router();

api.use("/access", accessRouter);
api.use("/catalog", catalogRouter);
api.use("/content", contentRouter);
api.use("/order", orderRouter);
api.use("/chatbot", chatbotRoute);

app.use("/api", api);
app.use("/api/uploads", uploadRouter);
app.use("/payments", paymentRouter);

app.use(notFoundMiddleware);
app.use(globalErrorHandler);
export default app;
