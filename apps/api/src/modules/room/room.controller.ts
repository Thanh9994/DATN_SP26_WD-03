import { generateSeats } from '@shared/script/seatsGenerate';
import { createRoomS, getRoomsByCinemaS } from './room.service';
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const room = await createRoomS(req.body);

    const layout = generateSeats(req.body)
    res.status(201).json({
      message: "Tạo phòng thành công",
      data:{room,
        totalSeats: layout.length,}
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const RoomsByCinema = async (req: Request, res: Response) => {
  try {
    const { cinemaId } = req.params;

    const rooms = await getRoomsByCinemaS(cinemaId);

    res.json({
      message: "Danh sách phòng",
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};