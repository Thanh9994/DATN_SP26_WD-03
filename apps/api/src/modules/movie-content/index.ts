import { Router } from "express";
import movieRouter from "./movie/movie.route";
import genreRouter from "./genre/genre.route";
import commentRouter from "./comments/comments.route";
import contactRoute from "../contact/contact.route";

const contentRouter = Router();

contentRouter.use("/movies", movieRouter);
contentRouter.use("/genres", genreRouter);
contentRouter.use("/comments", commentRouter);
contentRouter.use("/contact", contactRoute);

export default contentRouter;