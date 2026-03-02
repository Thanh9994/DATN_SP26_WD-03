import React from "react";
import { IShowTimeSeat } from "@shared/schemas"; // Đảm bảo interface này khớp với JSON của bạn

interface SeatMapProps {
  seats: IShowTimeSeat[];
  selectedSeatCodes: string[];
  onSeatClick: (seat: IShowTimeSeat) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatCodes,
  onSeatClick,
}) => {
  // 1. Nhóm ghế theo hàng (row)
  const rows = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    },
    {} as Record<string, IShowTimeSeat[]>,
  );

  // Sắp xếp các hàng theo thứ tự A, B, C... và số ghế 1, 2, 3...
  const sortedRows = Object.keys(rows).sort();

  const getSeatColor = (seat: IShowTimeSeat) => {
    if (seat.trang_thai === "booked")
      return "bg-zinc-700 cursor-not-allowed text-zinc-500";
    if (selectedSeatCodes.includes(seat.seatCode))
      return "bg-red-600 text-white border-red-400";

    switch (seat.loai_ghe) {
      case "vip":
        return "border-orange-500 text-orange-500 hover:bg-orange-500/20";
      case "couple":
        return "border-pink-500 text-pink-500 hover:bg-pink-500/20";
      default:
        return "border-zinc-500 text-zinc-400 hover:bg-zinc-500/20";
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-[#0a0a0a] rounded-xl ">
      {/* Màn hình */}
      <div className="w-full max-w-lg mb-12">
        <div className="h-1 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.5)] mb-2" />
        <p className="text-center text-zinc-500 text-sm tracking-[0.5em] uppercase">
          Màn Hình
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full overflow-x-auto pb-4 ">
        {sortedRows.map((rowLabel) => (
          <div
            key={rowLabel}
            className="flex items-center justify-center gap-2 min-w-max "
          >
            {/* Nhãn hàng bên trái */}
            <span className="w-4 text-zinc-600 font-bold text-sm">
              {rowLabel}
            </span>

            <div className="flex gap-2 ">
              {rows[rowLabel]
                .sort((a, b) => a.number - b.number)
                .map((seat) => (
                  <button
                    key={seat._id}
                    disabled={seat.trang_thai === "booked"}
                    onClick={() => onSeatClick(seat)}
                    className={`
                      w-6 h-6 md:w-7 md:h-7 md:no-scrollbar text-[8px] md:text-xs font-semibold rounded-md border-2 transition-all
                      flex items-center justify-center
                      ${getSeatColor(seat)}
                    `}
                  >
                    {seat.number}
                  </button>
                ))}
            </div>

            {/* Nhãn hàng bên phải */}
            <span className="w-6 text-zinc-600 font-bold text-sm">
              {rowLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Chú thích (Legend) */}
      <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-zinc-400 border-t border-zinc-800 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-zinc-500 rounded" />{" "}
          <span>Thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-orange-500 rounded" />{" "}
          <span>Vip</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-pink-500 rounded" />{" "}
          <span>Couple</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded" /> <span>Đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-700 rounded" /> <span>Đã bán</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
