import { Router } from "express";
import { createRoom, RoomsByCinema } from "./room.controller";

const roomRouter = Router();

roomRouter.post("/", createRoom);
roomRouter.get("/cinema/:cinemaId", RoomsByCinema);

export default roomRouter;