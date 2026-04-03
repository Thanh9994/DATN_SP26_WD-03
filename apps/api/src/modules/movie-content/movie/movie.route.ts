import { Router } from "express";
import { movieController } from "./movie.controller";
import { upload } from "@api/config/cloudinary";
import { authenticate, authorize } from "@api/middlewares/auth.middleware";

const movieRouter = Router();

movieRouter .get("/", movieController.getAllMovie);

movieRouter .get("/:id", movieController.getMovieById);

movieRouter.use(authenticate, authorize(['admin']));

movieRouter .post("/", upload.single("image"), movieController.createMovie);
movieRouter .put("/:id",movieController.updateMovie);
movieRouter .delete("/:id", movieController.deleteMovie);

export default movieRouter;