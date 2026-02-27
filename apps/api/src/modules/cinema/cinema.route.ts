import { Router } from "express";
import { addRoomsToCinema, AllCinemas, createCinema, deleteCinema, getCinemaById, updateCinema } from "./cinema.controller";

const cinemaRouter = Router();

cinemaRouter .get("/", AllCinemas);
cinemaRouter .get("/:id", getCinemaById);
cinemaRouter .post("/", createCinema);
cinemaRouter .put("/:id", updateCinema);
cinemaRouter .delete("/:id", deleteCinema);
cinemaRouter .patch("/:id/add-rooms", addRoomsToCinema);

export default cinemaRouter;