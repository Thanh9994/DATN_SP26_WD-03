import { authenticate, authorize } from "@api/middlewares/auth.middleware";
import { bookingController } from "./booking.controller";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.use(authenticate);

bookingRouter.post("/hold", bookingController.holdSeats);
bookingRouter.post("/confirm", bookingController.confirmBooking);
bookingRouter.post("/cancel", bookingController.cancelBooking);
bookingRouter.get("/detail/:id", bookingController.getBookingDetail);

bookingRouter.get(
  "/analytics/dashboard",
  authorize(["admin", "nhan_vien"]),
  bookingController.getDashboardStats,
);

export default bookingRouter;
