import { Router } from "express";
import movieRouter from "./movie/movie.route";
import genreRouter from "./genre/genre.route";

const contentRouter = Router();

contentRouter.use("/movies", movieRouter)
contentRouter.use("/genres", genreRouter)
contentRouter.use()

export default contentRouter;