import React from 'react';
import { IShowTimeSeat } from '@shared/src/schemas'; // Đảm bảo interface này khớp với JSON của bạn
import { Sparkles, UserCheck2 } from 'lucide-react';

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

    if (selectedSeatCodes.includes(seat.seatCode)) return 'bg-blue-600 text-white ';

    if (seat.trang_thai === 'hold' && seat.heldBy === currentUserId)
      return 'bg-yellow-500 text-black border-yellow-400';

    switch (seat.seatType) {
      case 'vip':
        return 'bg-[#ef444499] text-white border-[#131313] hover:bg-[#ef4444]';
      case 'couple':
        return 'bg-[#f9a8d499] text-white border-[#131313] hover:bg-[#f9a8d4]';
      default:
        return 'bg-[#9ca3afab] text-white border-[#131313] hover:bg-[#9ca3af]';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-[#0a0a0a] p-4">
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
                  const isSelected = selectedSeatCodes.includes(seat.seatCode);
                  const isCouple = seat.seatType === 'couple';
                  const isStandard = seat.seatType === 'normal';
                  const isMedium = seat.seatType === 'vip';
                  const isSeatShell = isStandard || isCouple || isMedium;

                  return (
                    <button
                      key={seat._id}
                      disabled={isDisabled}
                      onClick={() => onSeatClick(seat)}
                      className={`${isCouple ? 'h-6 w-8 md:h-8 md:w-10' : 'h-6 w-6 md:h-8 md:w-8'} ${isSeatShell ? 'seat-shell overflow-visible border' : 'rounded-md border-2'} relative flex items-center justify-center text-[10px] font-semibold transition-all md:text-xs ${getSeatColor(seat)}`}
                    >
                      {isSeatShell && <span className="foot" aria-hidden="true" />}
                      {seat.trang_thai === 'booked' ? (
                        <UserCheck2 className="h-4 w-4 text-zinc-400" />
                      ) : isSelected ? (
                        <Sparkles className="relative z-[3] h-4 w-4 text-white" />
                      ) : (
                        <span className={isSeatShell ? 'relative z-[3]' : undefined}>
                          {seat.number}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Nhãn hàng bên phải */}
            <span className="ml-auto w-4 text-sm font-bold text-zinc-600">{rowLabel}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-5 border-t border-zinc-800 pt-6 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="seat-shell standard relative h-5 w-5 border border-[#131313] bg-[#9ca3afab]">
            <span className="foot" aria-hidden="true" />
          </div>{' '}
          <span>Thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat-shell relative h-5 w-5 border border-[#131313] bg-[#ef444499]">
            <span className="foot" aria-hidden="true" />
          </div>{' '}
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seat-shell relative h-5 w-6 border border-[#131313] bg-[#f9a8d499]">
            <span className="foot" aria-hidden="true" />
          </div>{' '}
          <span>Couple</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4"/> <span>Đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-yellow-500" />
          <span>Đang giữ</span>
        </div>
        <div className="flex items-center gap-2">
          {/* <div className="h-4 w-4 rounded bg-zinc-700" />  */}
          <UserCheck2 /> <span>Đã đặt</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
