import { Router } from "express";
import { AllCinemas, bookSeats, confirmSeats, createCinema, deleteCinema, holdSeats, updateCinema } from "./cinema.controller";

const cinemaRouter = Router();

cinemaRouter .get("/", AllCinemas);
cinemaRouter .post("/", createCinema);
cinemaRouter .put("/:id", updateCinema);
cinemaRouter .delete("/:id", deleteCinema);
cinemaRouter.patch(
  "/:cinemaId/rooms/:roomId/seats",
  bookSeats
);
cinemaRouter.patch(
  "/:cinemaId/rooms/:roomId/seats/hold",
  holdSeats
);
cinemaRouter.patch(
  "/:cinemaId/rooms/:roomId/seats/confirm",
  confirmSeats
);

export default cinemaRouter;