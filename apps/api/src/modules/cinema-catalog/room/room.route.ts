import { Router } from "express";
import {
  AllRooms,
  createRoom,
  deleteRoom,
  RoomsByCinema,
} from "./room.controller";

const roomRouter = Router();

roomRouter.get("/", AllRooms);
roomRouter.post("/", createRoom);
roomRouter.delete("/:id", deleteRoom);
roomRouter.get("/cinema/:cinemaId", RoomsByCinema);

export default roomRouter;
