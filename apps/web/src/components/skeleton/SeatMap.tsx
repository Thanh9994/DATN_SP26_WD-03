import React from "react";
import { IShowTimeSeat } from "@shared/schemas"; // Đảm bảo interface này khớp với JSON của bạn

interface SeatMapProps {
  seats: IShowTimeSeat[];
  selectedSeatCodes: string[];
  onSeatClick: (seat: IShowTimeSeat) => void;
  currentUserId: string;
}

const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatCodes,
  onSeatClick,
  currentUserId,
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
  const seatTypeOrder = {
    normal: 0,
    vip: 1,
    couple: 2,
  };
  const sortedRows = Object.keys(rows).sort((a, b) => {
    const typeA = rows[a][0]?.seatType || "normal";
    const typeB = rows[b][0]?.seatType || "normal";

    if (seatTypeOrder[typeA] !== seatTypeOrder[typeB]) {
      return seatTypeOrder[typeA] - seatTypeOrder[typeB];
    }

    return a.localeCompare(b);
  });

  const getSeatColor = (seat: IShowTimeSeat) => {
    if (seat.trang_thai === "booked")
      return "bg-zinc-700 cursor-not-allowed text-zinc-500 border-zinc-700";

    if (seat.trang_thai === "hold" && seat.heldBy !== currentUserId)
      return "bg-yellow-500 text-black border-yellow-400 cursor-not-allowed";

    if (selectedSeatCodes.includes(seat.seatCode))
      return "bg-red-600 text-white border-red-400";

    if (seat.trang_thai === "hold" && seat.heldBy === currentUserId)
      return "bg-yellow-500 text-black border-yellow-400";

    switch (seat.seatType) {
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
        <div className="h-2 bg-red-800/40 rounded-t-[120px] shadow-[0_35px_90px_rgba(220,220,220,0.9)] mb-2" />
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
            <span className="w-4 mr-auto text-zinc-600 font-bold text-sm">
              {rowLabel}
            </span>

            <div className="flex gap-2 ">
              {rows[rowLabel]
                .sort((a, b) => {
                  if (a.seatType === "couple" && b.seatType !== "couple")
                    return 1;
                  if (a.seatType !== "couple" && b.seatType === "couple")
                    return -1;
                  return a.number - b.number;
                })
                .reduce((acc: IShowTimeSeat[][], seat, index, array) => {
                  if (seat.seatType === "couple") {
                    const nextSeat = array[index + 1];
                    if (
                      nextSeat &&
                      nextSeat.seatType === "couple" &&
                      nextSeat.number === seat.number + 1
                    ) {
                      acc.push([seat, nextSeat]);
                      array.splice(index + 1, 1);
                    } else {
                      acc.push([seat]);
                    }
                  } else {
                    acc.push([seat]);
                  }
                  return acc;
                }, [])
                .map((seatGroup) => {
                  const isCouple = seatGroup.length === 2;
                  const firstSeat = seatGroup[0];
                  const isDisabled = seatGroup.some((s) => {
                    if (s.trang_thai === "booked") return true;

                    if (s.trang_thai === "hold" && s.heldBy !== currentUserId)
                      return true;

                    return false;
                  });

                  return (
                    <button
                      key={seatGroup.map((s) => s._id).join("-")}
                      disabled={isDisabled}
                      onClick={() =>
                        seatGroup.forEach((seat) => onSeatClick(seat))
                      }
                      className={`
                        ${
                          isCouple
                            ? "w-14 md:w-16 rounded-xl bg-pink-500/20 border-pink-500 relative"
                            : "w-6 md:w-7"
                        }
                        h-6 md:h-7
                        text-[8px] md:text-xs
                        font-semibold
                        rounded-md
                        border-2
                        transition-all
                        flex items-center justify-center
                        ${getSeatColor(firstSeat)}
                      `}
                    >
                      {isCouple
                        ? `${seatGroup[0].number}-${seatGroup[1].number}`
                        : firstSeat.number}
                    </button>
                  );
                })}
            </div>

            {/* Nhãn hàng bên phải */}
            <span className="w-4 ml-auto text-zinc-600 font-bold text-sm">
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
          <div className="w-4 h-4 bg-yellow-500 rounded" />
          <span>Đang giữ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-700 rounded" /> <span>Đã bán</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
