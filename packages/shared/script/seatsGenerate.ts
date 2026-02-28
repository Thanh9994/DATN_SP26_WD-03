import { IPhong, ISeatsStatus, ISeatType } from "@shared/schemas";

export interface ISeatResult {
  seatNumber: string;
  row: string;
  type: ISeatType;
  priceMultiplier: number;
  isActive: ISeatsStatus;
}

export const generateSeats = (room: IPhong): ISeatResult[] => {
  const seats: ISeatResult[] = [];

  room.rows.forEach((rowObj: { name: string; seats: number }) => {
    for (let i = 1; i <= rowObj.seats; i++) {
      let seatType: ISeatType = "normal";
      let multiplier = 1;

      // Logic xác định loại ghế dựa trên các mảng vipRows/coupleRows
      if (room.couple?.includes(rowObj.name)) {
        seatType = "couple";
        multiplier = 2;
      } else if (room.vip?.includes(rowObj.name)) {
        seatType = "vip";
        multiplier = 1.5;
      }

      seats.push({
        seatNumber: `${rowObj.name}${i}`,
        row: rowObj.name,
        type: seatType,
        priceMultiplier: multiplier,
        isActive: "empty"
      });
    }
  });

  return seats;
};