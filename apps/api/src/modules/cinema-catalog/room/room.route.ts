import { Router } from "express";
import { AllRooms, createRoom, RoomsByCinema } from "./room.controller";

const roomRouter = Router();

roomRouter.get("/", AllRooms)
roomRouter.post("/", createRoom);
roomRouter.get("/cinema/:cinemaId", RoomsByCinema);

export default roomRouter;