import { IPhong, IShowTime } from "@shared/schemas";
import { SeatTime } from "./showtimeSeat.model";

export const generateShowTimeSeats = async (
  showTime: IShowTime,
  room: IPhong,
) => {
  if (!showTime._id) {
    throw new Error("ShowTime ID không tồn tại");
  }

  const existing = await SeatTime.countDocuments({
    showTimeId: showTime._id,
  });

  if (existing > 0) return;

  const seats = [];

  for (const row of room.rows) {
    for (let i = 1; i <= row.seats; i++) {

      let seatPrice = showTime.priceNormal;

      if (row.type === "vip") {
        seatPrice = showTime.priceVip;
      }

      if (row.type === "couple") {
        seatPrice = showTime.priceCouple;
      }

      seats.push({
        showTimeId: showTime._id,
        seatCode: `${row.name}${i}`,
        row: row.name,
        number: i,
        loai_ghe: row.type,
        price: seatPrice,
        trang_thai: "empty",
      });
    }
  }

  await SeatTime.insertMany(seats);
};