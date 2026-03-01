import express from "express";
import cors from "cors";
import uploadRouter from "./middlewares/upload";
import catalogRouter from "./modules/cinema-catalog";
import accessRouter from "./modules/access-control";
import contentRouter from "./modules/movie-content";
import testRoute from "./modules/test/test.route";
import oderRouter from "./modules/sales-operations";
import { initBookingCron } from "./utils/bookingCron.util";

const app = express();
initBookingCron();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/test", testRoute);
app.use("/api/uploads", uploadRouter);
app.use("/api/oder", oderRouter);
app.use("/api/access", accessRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/content", contentRouter);

export default app;
