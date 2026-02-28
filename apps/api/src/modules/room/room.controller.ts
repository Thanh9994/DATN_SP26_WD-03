import { generateSeats } from '@shared/script/seatsGenerate';
import { createRoomS, getAllRooms, getRoomsByCinemaS } from './room.service';
import { Request, Response } from "express";
import { Cinemas } from '../cinema/cinema.model';
import { Room } from './room.model';

export const AllRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await getAllRooms()
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
}

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

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Phòng không tồn tại" });

    const cinemaId = room.cinema_id;

    await Room.findByIdAndDelete(id);

    //Xóa ID phòng khỏi mảng danh_sach_phong của Cinema (Đồng bộ dữ liệu)
    await Cinemas.findByIdAndUpdate(
      cinemaId,
      { $pull: { danh_sach_phong: id } }
    );

    res.json({ message: "Xóa phòng và cập nhật rạp thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa phòng" });
  }
};