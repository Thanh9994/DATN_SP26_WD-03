import { Router } from "express";
import cinemaRoutes from "./cinema/cinema.route";
import roomRoutes from "./room/room.route";
import showtimeRoutes from "./showtime/showtime.route";
import postRoutes from "./promotions/post.route";

const catalogRouter = Router();

catalogRouter.use("/cinemas", cinemaRoutes);
catalogRouter.use("/rooms", roomRoutes);
catalogRouter.use("/showtimes", showtimeRoutes);
catalogRouter.use("/promotions", postRoutes);

export default catalogRouter;