import { Router } from "express";
import { movieController } from "./movie.controller";
import { upload } from "@api/config/cloudinary";

const movieRouter = Router();

movieRouter .get("/", movieController.getAllMovie);
movieRouter .get("/:id", movieController.getMovieById);
movieRouter .post("/", upload.single("image"), movieController.createMovie);
movieRouter .put("/:id",movieController.updateMovie);
movieRouter .delete("/:id", movieController.deleteMovie);

export default movieRouter;