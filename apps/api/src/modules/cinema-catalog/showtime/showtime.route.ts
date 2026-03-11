import { Router } from "express";
import {
  createShowTime,
  getShowTimeByMovie,
  getShowTimeDetail,
  deleteShowTime,
  getAllShowTimes,
  getShowTimeSeats,
  getSeatStats,
} from "./showtime.controller";

const showTimeRouter = Router();

showTimeRouter.get("/", getAllShowTimes);
showTimeRouter.post("/", createShowTime);
showTimeRouter.get("/movie/:movieId", getShowTimeByMovie);
showTimeRouter.get("/:id/seats", getShowTimeSeats);
showTimeRouter.get("/:id/seat-stats", getSeatStats);
showTimeRouter.get("/:id", getShowTimeDetail);
showTimeRouter.delete("/:id", deleteShowTime);

export default showTimeRouter;
