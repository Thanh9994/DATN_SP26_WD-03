import { authenticate, authorize } from "@api/middlewares/auth.middleware";
import { bookingController } from "./booking.controller";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.get("/detail/:id", bookingController.getBookingDetail);

bookingRouter.post("/hold", authenticate, bookingController.holdSeats);
bookingRouter.post("/confirm", authenticate, bookingController.confirmBooking);
bookingRouter.post("/cancel", authenticate, bookingController.cancelBooking);
bookingRouter.post("/expire", authenticate, bookingController.expireBooking);
bookingRouter.get(
  "/pending/:showtimeId",
  authenticate,
  bookingController.getPendingBooking,
);

bookingRouter.get(
  "/analytics/dashboard",
  authorize(["admin", "nhan_vien"]),
  bookingController.getDashboardStats,
);

export default bookingRouter;
