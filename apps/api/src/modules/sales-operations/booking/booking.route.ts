import { Router } from "express";
import {
  confirmBooking,
  getBookingDetail,
  holdSeats,
} from "./booking.controller";

const bookingRouter = Router();

bookingRouter.post("/hold", holdSeats);
bookingRouter.post("/confirm", confirmBooking);
bookingRouter.get("/:id", getBookingDetail);

export default bookingRouter;
