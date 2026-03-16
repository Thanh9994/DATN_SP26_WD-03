import { IPhong, ISeatType, IShowTime } from '@shared/schemas';
import { SeatTime } from './showtimeSeat.model';
import { ShowTimeM } from './showtime.model';
import mongoose from 'mongoose';

export const showTimeService = {
  async autoDeleteOldShowtimes(days: number = 25) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);

    // 1. Tìm các suất chiếu đã kết thúc cách đây 'days' ngày
    const oldShowTimes = await ShowTimeM.find({
      endTime: { $lt: thresholdDate },
    });

    if (oldShowTimes.length === 0) return 0;

    const idsToDelete = oldShowTimes.map((st) => st._id);

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // Xóa tất cả ghế của các suất chiếu này
        await SeatTime.deleteMany({ showTimeId: { $in: idsToDelete } }, { session });

        await ShowTimeM.deleteMany({ _id: { $in: idsToDelete } }, { session });
      });

      return idsToDelete.length;
    } catch (error) {
      console.error('Lỗi khi xóa suất chiếu cũ tự động:', error);
      throw error;
    } finally {
      session.endSession();
    }
  },
};

export const generateShowTimeSeats = async (showTime: IShowTime, room: IPhong) => {
  if (!showTime._id) throw new Error('ShowTime ID không tồn tại');

  const vipSet = new Set((room.vip || []).map((r) => r.trim().toUpperCase()));
  const coupleSet = new Set((room.couple || []).map((r) => r.trim().toUpperCase()));
  const seats: any[] = [];

  for (const row of room.rows) {
    const rowNameUp = row.name.trim().toUpperCase();
    let defaultPrice = showTime.priceNormal;
    let defaultType: ISeatType = 'normal';

    if (vipSet.has(rowNameUp)) {
      defaultPrice = showTime.priceVip;
      defaultType = 'vip';
    } else if (coupleSet.has(rowNameUp)) {
      defaultPrice = showTime.priceCouple;
      defaultType = 'couple';
    }
    for (let i = 1; i <= row.seats; i++) {
      seats.push({
        showTimeId: showTime._id,
        bookingId: null,
        ten_phong: room.ten_phong,
        seatCode: `${rowNameUp}${i}`,
        row: rowNameUp,
        number: i,
        seatType: defaultType,
        price: defaultPrice,
        trang_thai: 'empty',
      });
    }
  }
  const session = await SeatTime.startSession();
  try {
    await session.withTransaction(async () => {
      await SeatTime.deleteMany({ showTimeId: showTime._id }, { session });

      // Chèn hàng loạt ghế mới
      await SeatTime.insertMany(seats, { session, ordered: false });
    });
  } catch (error) {
    console.error('Lỗi khi tạo sơ đồ ghế cho suất chiếu:', error);
    throw new Error('Không thể tạo sơ đồ ghế. Vui lòng thử lại.');
  } finally {
    session.endSession();
  }
};

export const checkShowTimeOverlap = async (roomId: string, startTime: Date, endTime: Date) => {
  const CLEANING_TIME = 30 * 60000;

  const startWithBuffer = new Date(startTime.getTime() - CLEANING_TIME);
  const endWithBuffer = new Date(endTime.getTime() + CLEANING_TIME);

  const overlap = await ShowTimeM.findOne({
    roomId,
    status: { $ne: 'cancelled' },
    $or: [
      {
        startTime: { $lt: endWithBuffer }, // Bắt đầu trước khi suất mới dọn xong
        endTime: { $gt: startWithBuffer }, // Kết thúc sau khi suất mới bắt đầu dọn
      },
    ],
  });

  if (overlap) {
    throw new Error(
      `Phòng bận từ ${overlap.startTime.toLocaleTimeString()} - ${overlap.endTime.toLocaleTimeString()} (bao gồm 30p dọn dẹp).`,
    );
  }
  return false;
};
