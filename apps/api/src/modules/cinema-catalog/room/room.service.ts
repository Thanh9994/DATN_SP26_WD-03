import { IPhong } from "@shared/schemas";
import { Room } from "./room.model";

export const getAllRooms = async () => {
  return await Room.find().populate("cinema_id", "name city address");
};

export const createRoomS = async (data: IPhong) => {
  return await Room.create(data);
};

export const getRoomsByCinemaS = async (cinemaId: string) => {
  return await Room.find({ cinema_id: cinemaId }).populate(
    "cinema_id",
    "name city address",
  );
};
