import { Request, Response } from "express";
import { ShowTime as ShowTimeSchema } from "@shared/schemas";
import { generateShowTimeSeats } from "./showtime.service";
import { ShowTimeM } from "./showtime.model";
import { Cinemas } from "../cinema/cinema.model";
import { SeatTime } from "./showtimeSeat.model";

export const createShowTime = async (req: Request, res: Response) => {
  try {
    const payload = ShowTimeSchema.parse(req.body);
    const cinema = await Cinemas.findOne({
      "phong_chieu._id": payload.roomId,
    });
    if (!cinema)
      return res.status(404).json({ message: "Không tìm thấy phòng" });

    const roomDoc = cinema.phong_chieu.id(payload.roomId);
    if (!roomDoc)
      return res.status(404).json({ message: "Phòng không tồn tại" });

    const room = roomDoc.toObject();
    const newShowTime = await ShowTimeM.create(payload);
    await generateShowTimeSeats(newShowTime.toObject(), room);

    return res.status(201).json({
      message: "Tạo suất chiếu thành công",
      data: newShowTime,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      error,
    });
  }
};

export const getShowTimeByMovie = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const showtimes = await ShowTimeM.find({ movieId });

    return res.json({
      message: "Lấy suất chiếu thành công",
      data: showtimes,
    });
  } catch {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const getShowTimeDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const showTime = await ShowTimeM.findById(id);
    if (!showTime) {
      return res.status(404).json({
        message: "Không tìm thấy suất chiếu",
      });
    }

    const seats = await SeatTime.find({
      showTimeId: id,
    });

    return res.json({
      showTime,
      seats,
    });
  } catch {
    return res.status(400).json({
      message: "Lỗi lấy chi tiết suất chiếu",
    });
  }
};

export const deleteShowTime = async ( req: Request, res: Response ) => {
  try {
    const { id } = req.params;

    await ShowTimeM.findByIdAndDelete(id);
    await SeatTime.deleteMany({
      showTimeId: id,
    });

    return res.json({
      message: "Xoá suất chiếu thành công",
    });
  } catch {
    return res.status(400).json({
      message: "Lỗi xoá suất chiếu",
    });
  }
};
