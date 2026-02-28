import { Request, Response } from "express";
import { ShowTime as ShowTimeSchema } from "@shared/schemas";
import { generateShowTimeSeats } from "./showtime.service";
import { ShowTimeM } from "./showtime.model";
import { SeatTime } from "./showtimeSeat.model";
import { Room } from "../room/room.model";
import { Movie } from "../../movie-content/movie/movie.model";

export const createShowTime = async (req: Request, res: Response) => {
  try {
    const { movieId, roomId, date, timeSlot, ...prices } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Phim không tồn tại" });
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "không tồn tại phòng" });

    let startTime: Date;
    if (req.body.startTime) {
      startTime = new Date(req.body.startTime);
    } else if (date && timeSlot) {
      const [hours, minutes] = timeSlot.split(":").map(Number);
      startTime = new Date(date);
      startTime.setHours(hours, minutes, 0, 0);
    } else {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin thời gian chiếu" });
    }

    const startRelease = new Date(movie.ngay_cong_chieu);
    const endRelease = new Date(movie.ngay_ket_thuc);

    if (startTime < startRelease || startTime > endRelease) {
      return res.status(400).json({
        message: `Không thể tạo suất chiếu, Phim chỉ chiếu từ ${startRelease.toLocaleDateString()} đến ${endRelease.toLocaleDateString()}`,
      });
    }

    const durationInMs = (movie.thoi_luong || 0) * 60000;
    const endTime = new Date(startTime.getTime() + durationInMs);

    const isOver = await ShowTimeM.findOne({
      roomId: roomId,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });
    if (isOver) {
      return res.status(400).json({
        message: "Phòng này đã có lịch chiếu khác trong khoảng thời gian này!",
        overlappingWith: {
          start: isOver.startTime,
          end: isOver.endTime,
        },
      });
    }

    const payload = ShowTimeSchema.parse({
      ...prices,
      movieId,
      roomId,
      startTime,
      endTime,
    });

    const newShowTime = await ShowTimeM.create(payload);
    try {
      // console.log("Room structure:", room.rows);
      await generateShowTimeSeats(newShowTime.toObject(), room.toObject());
      return res.status(201).json({
        message: `Tạo suất chiếu lúc ${startTime.toLocaleTimeString()} ngày ${startTime.toLocaleDateString()} thành công`,
        data: newShowTime,
      });
    } catch (error) {
      await ShowTimeM.findByIdAndDelete(newShowTime._id);
      return res.status(400).json({ message: "Lỗi sinh ghế", error });
    }
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
    const showtimes = await ShowTimeM.find({ movieId }).sort({ startTime: 1 });

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

export const deleteShowTime = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const showTimeInfo = await ShowTimeM.findById(id).populate("roomId");
    if (!showTimeInfo) {
      return res.status(404).json({ message: "Không tìm thấy suất chiếu" });
    }

    const hasActiveSeats = await SeatTime.exists({
      showTimeId: id,
      trang_thai: { $in: ["booked", "hold"] },
    });

    if (hasActiveSeats) {
      return res.status(400).json({
        message: "Không thể xóa suất chiếu này vì đã có vé được đặt!",
      });
    }
    const totalToDelete = await SeatTime.countDocuments({ showTimeId: id });

    await ShowTimeM.findByIdAndDelete(id);
    await SeatTime.deleteMany({
      showTimeId: id,
    });

    return res.json({
      message: "Xoá suất chiếu và toàn bộ ghế trống thành công",
      totalSeats: totalToDelete,
    });
  } catch {
    return res.status(400).json({
      message: "Lỗi xoá suất chiếu",
    });
  }
};
