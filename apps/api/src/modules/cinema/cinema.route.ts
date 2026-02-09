import { Router } from "express";
import { AllCinemas, createCinema } from "./cinema.controller";

const cinemaRouter = Router();

cinemaRouter .get("/", AllCinemas);
cinemaRouter .post("/", createCinema);

export default cinemaRouter;