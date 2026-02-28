import { Router } from "express";
import {
  createShowTime,
  getShowTimeByMovie,
  getShowTimeDetail,
  deleteShowTime,
} from "./showtime.controller";

const showTimeRouter = Router();

showTimeRouter.post("/", createShowTime);
showTimeRouter.get("/movie/:movieId", getShowTimeByMovie);
showTimeRouter.get("/:id", getShowTimeDetail);
showTimeRouter.delete("/:id", deleteShowTime);

export default showTimeRouter;