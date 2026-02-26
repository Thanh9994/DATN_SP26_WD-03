import { Router } from "express";
import { AllCinemas, createCinema, deleteCinema, updateCinema } from "./cinema.controller";

const cinemaRouter = Router();

cinemaRouter .get("/", AllCinemas);
cinemaRouter .post("/", createCinema);
cinemaRouter .put("/:id", updateCinema);
cinemaRouter .delete("/:id", deleteCinema);

export default cinemaRouter;