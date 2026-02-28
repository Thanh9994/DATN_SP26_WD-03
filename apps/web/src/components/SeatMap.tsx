import { IShowTimeSeat } from "@shared/schemas";
import React from "react";

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
  // Nhóm ghế theo hàng (row)
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort();

  // Hàm xử lý style dựa trên trạng thái và loại ghế từ Schema
  const getSeatStyles = (seat: IShowTimeSeat) => {
    const isSelected = selectedSeatCodes.includes(seat.seatCode);

    // 1. Base Styles (Kích thước)
    let baseStyle =
      "h-9 rounded-md flex items-center justify-center text-[10px] font-medium transition-all duration-200 cursor-pointer ";
    baseStyle += seat.loai_ghe === "couple" ? "w-20" : "w-9"; // Ghế đôi rộng hơn

    // 2. Trạng thái (SeatsStatus: empty, booked, hold, fix)
    if (seat.trang_thai === "booked")
      return baseStyle + " bg-zinc-800 text-zinc-600 cursor-not-allowed";
    if (seat.trang_thai === "fix")
      return (
        baseStyle +
        " bg-red-900/50 text-red-200 border border-red-700 cursor-not-allowed"
      );
    if (seat.trang_thai === "hold")
      return baseStyle + " bg-yellow-600 text-white animate-pulse";

    // 3. Màu sắc theo Loại ghế khi đang Trống (SeatType: normal, vip, couple)
    if (isSelected)
      return (
        baseStyle +
        " bg-primary-500 bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]"
      );

    switch (seat.loai_ghe) {
      case "vip":
        return (
          baseStyle +
          " border border-orange-500/50 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white"
        );
      case "couple":
        return (
          baseStyle +
          " border border-pink-500/50 bg-pink-500/10 text-pink-400 hover:bg-pink-500 hover:text-white"
        );
      default: // normal
        return (
          baseStyle +
          " border border-zinc-600 bg-zinc-900 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        );
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 w-full bg-[#0a0a0a] p-8 rounded-2xl overflow-x-auto">
      {/* Màn hình (Screen) */}
      <div className="relative w-full max-w-2xl mb-16">
        <div className="h-3 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_4px_20px_rgba(59,130,246,0.8)]" />
        <p className="text-center text-zinc-500 text-[10px] uppercase tracking-[0.5em] mt-4">
          Màn hình
        </p>
      </div>

      {/* Sơ đồ ghế */}
      <div className="flex flex-col gap-3 min-w-max">
        {rows.map((rowLabel) => (
          <div key={rowLabel} className="flex items-center gap-4">
            {/* Tên hàng bên trái */}
            <span className="w-6 text-zinc-600 font-bold text-sm text-center">
              {rowLabel}
            </span>

            <div className="flex m-auto gap-2">
              {seats
                .filter((s) => s.row === rowLabel)
                .sort((a, b) => a.number - b.number)
                .map((seat) => (
                  <div
                    key={seat._id || seat.seatCode}
                    onClick={() =>
                      seat.trang_thai === "empty" && onSeatClick(seat)
                    }
                    className={getSeatStyles(seat)}
                    title={`${seat.seatCode} - ${seat.loai_ghe} - ${seat.price.toLocaleString()}đ`}
                  >
                    {seat.trang_thai === "fix" ? "✕" : seat.number}
                  </div>
                ))}
            </div>

            {/* Tên hàng bên phải */}
            <span className="w-6 text-zinc-600 font-bold text-sm text-center">
              {rowLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Chú thích (Legend) */}
      <div className="flex flex-wrap justify-center gap-6 mt-12 pt-6 border-t border-zinc-800 w-full">
        <LegendItem label="Thường" color="border-zinc-600 bg-zinc-900" />
        <LegendItem label="VIP" color="border-orange-500/50 bg-orange-500/10" />
        <LegendItem
          label="Ghế đôi"
          color="border-pink-500/50 bg-pink-500/10"
          isCouple
        />
        <LegendItem label="Đang chọn" color="bg-red-600" />
        <LegendItem label="Đã đặt" color="bg-pink-500" />
        <LegendItem label="Bảo trì" color="bg-red-900/50 border-red-700" />
      </div>
    </div>
  );
};

// Sub-component cho chú thích
const LegendItem = ({
  label,
  color,
  isCouple,
}: {
  label: string;
  color: string;
  isCouple?: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div className={`h-4 rounded ${isCouple ? "w-8" : "w-4"} ${color}`} />
    <span className="text-[11px] text-zinc-400">{label}</span>
  </div>
);

export default SeatMap;
