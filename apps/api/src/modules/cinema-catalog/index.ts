import { Router } from "express";
import cinemaRoutes from "./cinema/cinema.route";
import roomRoutes from "./room/room.route";
import showtimeRoutes from "./showtime/showtime.route";

const catalogRouter = Router();

catalogRouter.use("/cinemas", cinemaRoutes);
catalogRouter.use("/rooms", roomRoutes);
catalogRouter.use("/showtimes", showtimeRoutes);

export default catalogRouter;