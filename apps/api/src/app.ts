import express from "express";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";

import uploadRouter from "./middlewares/upload";
import catalogRouter from "./modules/cinema-catalog";
import accessRouter from "./modules/access-control";
import contentRouter from "./modules/movie-content";
import orderRouter from "./modules/sales-operations";
import adminDashboardRouter from "./modules/admin-dashboard";
import paymentRouter from "./modules/sales-operations/payments/payment.route";
import chatbotRoute from "./modules/chatbot/chatbot.route";
import contactRoute from "./modules/contact/contact.route";
import analyticsRouter from "./modules/analytics";
import ticketRouter from "./modules/ticket/ticket.route";
import staffRouter from "./modules/staff";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.set("etag", false);
app.use(compression());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(
    morgan(
      ":method :url :status :response-time ms :res[content-length] :remote-addr"
    )
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const api = express.Router();
api.use("/access", accessRouter);
api.use("/catalog", catalogRouter);
api.use("/content", contentRouter);
api.use("/order", orderRouter);
api.use("/admin", adminDashboardRouter);
api.use("/chatbot", chatbotRoute);
api.use("/contact", contactRoute);
api.use("/analytics", analyticsRouter);
api.use("/ticket", ticketRouter);
api.use("/staff", staffRouter);

app.use("/api", api);
app.use("/api/uploads", uploadRouter);
app.use("/payments", paymentRouter);
app.use("/api/chatbot", chatbotRoute);
app.use(globalErrorHandler);

export default app;