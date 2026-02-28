import { Router } from "express";
import { confirmBooking, holdSeats } from "./booking.controller";

const bookingRouter = Router();

bookingRouter.post("/hold", holdSeats);
bookingRouter.post("/confirm", confirmBooking);

export default bookingRouter;
