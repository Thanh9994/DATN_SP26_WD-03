import { Router } from "express";
import { movieController } from "./movie.controller";

const movieRouter = Router();

movieRouter .get("/", movieController.getAllMovie);
movieRouter .get("/:id", movieController.getMovieById);
movieRouter .post("/", movieController.createMovie);
movieRouter .put("/:id",movieController.updateMovie);
movieRouter .delete("/:id", movieController.deleteMovie);

export default movieRouter;