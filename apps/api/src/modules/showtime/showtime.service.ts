import { IPhong, IShowTime } from "@shared/schemas";
import { SeatTime } from "./showtimeSeat.model";

export const generateShowTimeSeats = async (
  showTime: IShowTime,
  room: IPhong,
) => {
  if (!showTime._id) {
    throw new Error("ShowTime ID không tồn tại");
  }
  const seats = [];

  for (const row of room.rows) {
    for (let i = 1; i <= room.seatsPerRow; i++) {
      const isVip = room.vipRows?.includes(row);
      const seatType = isVip ? "vip" : "thuong";

      seats.push({
        showTimeId: showTime._id!,
        seatCode: `${row}${i}`,
        row,
        number: i,
        loai_ghe: seatType,
        price: seatType === "vip" ? showTime.priceVip : showTime.priceNormal,
        trang_thai: "empty",
      });
    }
  }

  await SeatTime.insertMany(seats);
};
