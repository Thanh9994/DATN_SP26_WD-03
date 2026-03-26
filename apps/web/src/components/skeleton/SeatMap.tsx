import React from 'react';
import { IShowTimeSeat } from '@shared/schemas'; // Đảm bảo interface này khớp với JSON của bạn

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
    const typeA = rows[a][0]?.seatType || 'normal';
    const typeB = rows[b][0]?.seatType || 'normal';

    if (seatTypeOrder[typeA] !== seatTypeOrder[typeB]) {
      return seatTypeOrder[typeA] - seatTypeOrder[typeB];
    }

    return a.localeCompare(b);
  });

  const getSeatColor = (seat: IShowTimeSeat) => {
    if (seat.trang_thai === 'booked')
      return 'bg-zinc-700 cursor-not-allowed text-zinc-500 border-zinc-700';

    if (seat.trang_thai === 'hold' && seat.heldBy !== currentUserId)
      return 'bg-yellow-500 text-black border-yellow-400 cursor-not-allowed';

    if (selectedSeatCodes.includes(seat.seatCode)) return 'bg-red-600 text-white border-red-400';

    if (seat.trang_thai === 'hold' && seat.heldBy === currentUserId)
      return 'bg-yellow-500 text-black border-yellow-400';

    switch (seat.seatType) {
      case 'vip':
        return 'border-orange-500 text-orange-500 hover:bg-orange-500/20';
      case 'couple':
        return 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/20';
      default:
        return 'border-zinc-500 text-zinc-400 hover:bg-zinc-500/20';
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl bg-[#0a0a0a] p-4">
      {/* Màn hình */}
      <div className="mb-12 w-full max-w-lg">
        <div className="mb-2 h-2 rounded-t-[120px] bg-red-800/40 shadow-[0_35px_90px_rgba(220,220,220,0.9)]" />
        <p className="text-center text-sm uppercase tracking-[0.5em] text-zinc-500">Màn Hình</p>
      </div>

      <div className="flex w-full flex-col gap-2 overflow-x-auto pb-4">
        {sortedRows.map((rowLabel) => (
          <div key={rowLabel} className="flex min-w-max items-center justify-center gap-2">
            {/* Nhãn hàng bên trái */}
            <span className="mr-auto w-4 text-sm font-bold text-zinc-600">{rowLabel}</span>

            <div className="flex gap-2">
              {rows[rowLabel]
                .sort((a, b) => {
                  if (a.seatType === 'couple' && b.seatType !== 'couple') return 1;
                  if (a.seatType !== 'couple' && b.seatType === 'couple') return -1;
                  return a.number - b.number;
                })
                .map((seat) => {
                  const isDisabled =
                    seat.trang_thai === 'booked' ||
                    (seat.trang_thai === 'hold' && seat.heldBy !== currentUserId);
                  const isCouple = seat.seatType === 'couple';

                  return (
                    <button
                      key={seat._id}
                      disabled={isDisabled}
                      onClick={() => onSeatClick(seat)}
                      className={` ${isCouple ? 'h-7 w-8 md:h-8 md:w-9' : 'h-6 w-6 md:h-7 md:w-7'} flex items-center justify-center rounded-md border-2 text-[8px] font-semibold transition-all md:text-xs ${getSeatColor(seat)} `}
                    >
                      {seat.number}
                    </button>
                  );
                })}
            </div>

            {/* Nhãn hàng bên phải */}
            <span className="ml-auto w-4 text-sm font-bold text-zinc-600">{rowLabel}</span>
          </div>
        ))}
      </div>

      {/* Chú thích (Legend) */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 border-t border-zinc-800 pt-6 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-zinc-500" /> <span>Thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-orange-500" /> <span>Vip</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-cyan-500" /> <span>Couple</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-600" /> <span>Đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-yellow-500" />
          <span>Đang giữ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-zinc-700" /> <span>Đã bán</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
