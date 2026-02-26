import { ISeats, ISeatType } from '../schemas/index';
export const generateSeats = (
  rows: string[],
  seatsPerRow: number,
  vipRows: string[] = [],
  coupleLastSeats: number = 2
): ISeats[] => {
  const seats: ISeats[] = [];

  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      let type: ISeatType = "thuong";

      // VIP row
      if (vipRows.includes(row)) {
        type = "vip";
      }

      // Couple seats (hàng cuối)
      const isLastRow = rowIndex === rows.length - 1;
      const isCoupleSeat = i > seatsPerRow - coupleLastSeats;

      if (isLastRow && isCoupleSeat) {
        type = "couple";
      }

      seats.push({
        hang_ghe: row,
        so_ghe: i,
        loai_ghe: type,
        trang_thai: "trong",
      });
    }
  });

  return seats;
};