import { Room } from "./room.model";

export const createRoomS = async (data: any) => {
  return await Room.create(data);
};

export const getRoomsByCinemaS = async (cinemaId: string) => {
  return await Room.find({ cinema_id: cinemaId });
};