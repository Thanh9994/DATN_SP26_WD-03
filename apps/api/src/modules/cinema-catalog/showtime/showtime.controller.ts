import { Request, Response } from 'express';
import { ShowTime as ShowTimeSchema } from '@shared/schemas';
import { generateShowTimeSeats } from './showtime.service';
import { ShowTimeM } from './showtime.model';
import { SeatTime } from './showtimeSeat.model';
import { Room } from '../room/room.model';
import { Movie } from '../../movie-content/movie/movie.model';
import { CalculateShowTimeStatus, ShowTimeDisplay } from '@api/utils/showtime/showtime.util';
import mongoose from 'mongoose';

const sendError = (res: Response, status: number, message: string, error?: any) => {
  return res.status(status).json({ message, error: error?.message || error });
};

export const createShowTime = async (req: Request, res: Response) => {
  try {
    const { movieId, roomId, date, timeSlot, ...prices } = req.body;
    const cleaning_TIME = 30 * 60000;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Phim không tồn tại' });
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'không tồn tại phòng' });

    let startTime: Date;
    if (req.body.startTime) {
      startTime = new Date(req.body.startTime);
    } else if (date && timeSlot) {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      startTime = new Date(date);
      startTime.setHours(hours, minutes, 0, 0);
    } else {
      return res.status(400).json({ message: 'Thiếu thông tin thời gian chiếu' });
    }
    //Chặn suất chiếu ngày hôm nay
    const now = new Date();
    if (startTime < now) {
      return sendError(
        res,
        400,
        'Ngày chiếu không hợp lệ. Không thể tạo suất chiếu trong quá khứ!',
      );
    }

    const startRelease = new Date(movie.ngay_cong_chieu);
    const endRelease = new Date(movie.ngay_ket_thuc);

    if (startTime < startRelease || startTime > endRelease) {
      return sendError(
        res,
        400,
        `Phim chỉ chiếu từ ${startRelease.toLocaleDateString()} đến ${endRelease.toLocaleDateString()}`,
      );
    }

    const durationInMs = (movie.thoi_luong || 0) * 60000;
    const movieEndTime = new Date(startTime.getTime() + durationInMs);
    const cleaningEnd = new Date(movieEndTime.getTime() + cleaning_TIME);

    const isOver = await ShowTimeM.findOne({
      roomId,
      startTime: { $lt: cleaningEnd },
      endTime: { $gt: startTime },
    });
    if (isOver) {
      const suggestedStart = new Date(isOver.endTime.getTime() + cleaning_TIME);
      return res.status(400).json({
        message: `Phòng này đang bận hoặc đang dọn dẹp.`,
        movie: isOver.movieId, // Bạn có thể populate thêm tên phim ở đây nếu cần
        start: isOver.startTime,
        end: isOver.endTime,
        suggestedNextAvailable: suggestedStart.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    }

    const payload = ShowTimeSchema.parse({
      ...prices,
      movieId,
      roomId,
      startTime,
      endTime: movieEndTime,
      status: 'upcoming',
    });

    const newShowTime = await ShowTimeM.create(payload);
    try {
      // console.log("Ghế và hàng ghế:", room.rows);
      await generateShowTimeSeats(newShowTime.toObject(), room.toObject());
      return res.status(201).json({
        message: `Tạo suất chiếu lúc ${startTime.toLocaleTimeString()} ngày ${startTime.toLocaleDateString()} thành công`,
        data: newShowTime,
      });
    } catch (error) {
      await ShowTimeM.findByIdAndDelete(newShowTime._id);
      return res.status(400).json({ message: 'Lỗi hệ thống khi khởi tạo sơ đồ ghế', error });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      error,
    });
  }
};

export const getAllShowTimes = async (req: Request, res: Response) => {
  try {
    const { date, month, year } = req.query;
    let query = {};

    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);
      query = { startTime: { $gte: startOfDay, $lte: endOfDay } };
    } else if (month && year) {
      const monthNum = Number(month);
      const yearNum = Number(year);
      if (!Number.isFinite(monthNum) || !Number.isFinite(yearNum)) {
        return res.status(400).json({ message: 'Tháng hoặc năm không hợp lệ' });
      }
      const startOfMonth = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
      query = { startTime: { $gte: startOfMonth, $lte: endOfMonth } };
    } else if (year) {
      const yearNum = Number(year);
      if (!Number.isFinite(yearNum)) {
        return res.status(400).json({ message: 'Năm không hợp lệ' });
      }
      const startOfYear = new Date(yearNum, 0, 1, 0, 0, 0, 0);
      const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59, 999);
      query = { startTime: { $gte: startOfYear, $lte: endOfYear } };
    }

    const showtimes = await ShowTimeM.find(query)
      .populate('movieId', 'ten_phim thoi_luong')
      // rooms -> rạp -> tên - địa chỉ - thành phố
      .populate({
        path: 'roomId',
        select: 'ten_phong cinema_id',
        populate: {
          path: 'cinema_id',
          select: 'name city address',
        },
      })
      .sort({ startTime: -1 });

    const dataWithStatus = showtimes.map((st) => {
      const item = st.toObject();
      const status = CalculateShowTimeStatus(item);
      return {
        ...item,
        status,
        display: ShowTimeDisplay(status),
      };
    });

    return res.json({
      message: 'Lấy danh sách suất chiếu thành công',
      data: dataWithStatus,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const getShowTimeByMovie = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { includePast } = req.query as { includePast?: string };
    const now = new Date(Date.now() - 15 * 60 * 1000);
    const baseQuery: Record<string, any> = { movieId };
    if (includePast !== 'true') {
      baseQuery.startTime = { $gt: now };
    }

    const showtimes = await ShowTimeM.find(baseQuery)
      .populate({
        path: 'roomId',
        select: 'ten_phong cinema_id',
        populate: { path: 'cinema_id', select: 'name city address' },
      })
      .sort({ startTime: -1 });
    const showtimeIds = showtimes.map((st) => st._id);

    const seatStats = await SeatTime.aggregate([
      { $match: { showTimeId: { $in: showtimeIds } } },
      {
        $group: {
          _id: '$showTimeId',
          total: { $sum: 1 },
          booked: {
            $sum: {
              $cond: [{ $in: ['$trang_thai', ['booked', 'hold']] }, 1, 0],
            },
          },
          bookedOnly: {
            $sum: {
              $cond: [{ $eq: ['$trang_thai', 'booked'] }, 1, 0],
            },
          },
        },
      },
    ]);

    const statsMap = new Map(seatStats.map((s) => [s._id.toString(), s]));

    const dataWithStatus = showtimes.map((st) => {
      const item = st.toObject();
      const timeStatus = CalculateShowTimeStatus({
        ...item,
        status: 'upcoming',
      });
      const stats = statsMap.get(item._id.toString()) || {
        total: 0,
        booked: 0,
        bookedOnly: 0,
      };
      const isSoldOut =
        stats.total > 0 && stats.bookedOnly >= stats.total && item.status !== 'cancelled';
      const status = item.status === 'cancelled' ? 'cancelled' : isSoldOut ? 'sold_out' : timeStatus;

      return {
        ...item,
        status,
        display: ShowTimeDisplay(status),
        seatInfo: { total: stats.total, booked: stats.booked },
      };
    });

    return res.json({
      message: 'Lấy suất chiếu thành công',
      data: dataWithStatus,
    });
  } catch {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getShowTimeDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const showTime = await ShowTimeM.findById(id)
      .populate('movieId')
      .populate({
        path: 'roomId',
        populate: {
          path: 'cinema_id',
          select: 'name city address',
        },
      });
    if (!showTime) return res.status(404).json({ message: 'Không tìm thấy' });

    const seats = await SeatTime.find({
      showTimeId: id,
    });

    return res.json({
      showTime,
      seats,
    });
  } catch (error) {
    return sendError(res, 500, 'Lỗi lấy chi tiết suất chiếu', error);
  }
};

export const deleteShowTime = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const showTimeInfo = await ShowTimeM.findById(id).populate('roomId');
    if (!showTimeInfo) {
      return res.status(404).json({ message: 'Không tìm thấy suất chiếu' });
    }

    const hasActiveSeats = await SeatTime.exists({
      showTimeId: id,
      trang_thai: { $in: ['booked', 'hold'] },
    });

    if (hasActiveSeats) {
      return res.status(400).json({
        message: 'Không thể xóa suất chiếu này vì đã có vé được đặt!',
      });
    }
    const totalToDelete = await SeatTime.countDocuments({ showTimeId: id });

    await ShowTimeM.findByIdAndDelete(id);
    await SeatTime.deleteMany({
      showTimeId: id,
    });

    return res.json({
      message: 'Xoá suất chiếu và toàn bộ ghế trống thành công',
      totalSeats: totalToDelete,
    });
  } catch (error) {
    return sendError(res, 400, 'Lỗi xoá suất chiếu', error);
  }
};

export const getShowTimeSeats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seats = await SeatTime.find({ showTimeId: id }).sort({
      row: 1,
      number: 1,
    });

    return res.json({
      success: true,
      data: seats,
    });
  } catch (error) {
    return sendError(res, 500, 'Lỗi lấy danh sách ghế', error);
  }
};

export const getSeatStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stats = await SeatTime.aggregate([
      { $match: { showTimeId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          booked: {
            $sum: { $cond: [{ $eq: ['$trang_thai', 'booked'] }, 1, 0] },
          },
          held: {
            $sum: { $cond: [{ $eq: ['$trang_thai', 'hold'] }, 1, 0] },
          },
          available: {
            $sum: { $cond: [{ $eq: ['$trang_thai', 'empty'] }, 1, 0] },
          },
        },
      },
    ]);

    const result = stats[0] || { total: 0, booked: 0, held: 0, available: 0 };

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return sendError(res, 500, 'Lỗi lấy thống kê ghế', error);
  }
};
