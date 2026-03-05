import { Router } from "express";
import CinemaController, {
  addRoomsToCinema,
  createCinema,
  deleteCinema,
  updateCinema,
} from "./cinema.controller";

const cinemaRouter = Router();

cinemaRouter.get("/", CinemaController.AllCinemas);
cinemaRouter.get("/:id", CinemaController.getCinemaById);
cinemaRouter.post("/", createCinema);
cinemaRouter.put("/:id", updateCinema);
cinemaRouter.delete("/:id", deleteCinema);
cinemaRouter.patch("/:id/add-rooms", addRoomsToCinema);

export default cinemaRouter;
