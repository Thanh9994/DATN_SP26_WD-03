import { Router } from "express";
import {
  AllRooms,
  createRoom,
  deleteRoom,
  RoomsByCinema,
  updateRoom,
} from "./room.controller";

const roomRouter = Router();

roomRouter.get("/", AllRooms);
roomRouter.post("/", createRoom);
roomRouter.delete("/:id", deleteRoom);
roomRouter.put("/:id", updateRoom);
roomRouter.get("/cinema/:cinemaId", RoomsByCinema);

export default roomRouter;
