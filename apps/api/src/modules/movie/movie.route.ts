import { Router } from "express";
import { AllMovie, createMovie, deleteMovie, getMovieById, updateMovie } from "./movie.controller";

const movieRouter = Router();

movieRouter .get("/", AllMovie);
movieRouter .get("/:id", getMovieById);
movieRouter .post("/", createMovie);
movieRouter .put("/:id", updateMovie);
movieRouter .delete("/:id", deleteMovie);

export default movieRouter;