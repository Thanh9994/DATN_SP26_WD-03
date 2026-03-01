import { IPhong, IShowTime } from "@shared/schemas";
import { SeatTime } from "./showtimeSeat.model";
export const showTimeService = {};
export const generateShowTimeSeats = async (
  showTime: IShowTime,
  room: IPhong,
) => {
  if (!showTime._id) {
    throw new Error("ShowTime ID không tồn tại");
  }

  await SeatTime.deleteMany({ showTimeId: showTime._id });

  const seats = [];
  const vipRows = room.vip || [];
  const coupleRows = room.couple || [];

  for (const row of room.rows) {
    const rowNameUp = row.name.trim().toUpperCase();
    for (let i = 1; i <= row.seats; i++) {
      let seatPrice = showTime.priceNormal;
      let seatType = "normal";

      if (vipRows.some((r) => r.toUpperCase() === rowNameUp)) {
        seatPrice = showTime.priceVip;
        seatType = "vip";
      } else if (coupleRows.some((r) => r.toUpperCase() === rowNameUp)) {
        seatPrice = showTime.priceCouple;
        seatType = "couple";
      }

      seats.push({
        showTimeId: showTime._id,
        ten_phong: room.ten_phong,
        seatCode: `${rowNameUp}${i}`,
        row: rowNameUp,
        number: i,
        loai_ghe: seatType,
        price: seatPrice,
        trang_thai: "empty",
      });
    }
  }

  try {
    await SeatTime.insertMany(seats, { ordered: false });
  } catch (error) {
    console.error("Lỗi duplicate khi insertMany:", error);
  }
};
