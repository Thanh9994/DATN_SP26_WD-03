import { useSearchParams, useOutletContext } from "react-router-dom"; // Thêm useOutletContext
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "@web/api/api.service";
import { IShowTimeSeat } from "@shared/schemas";
import { Spin } from "antd";

export default function SeatBooking() {
  const [searchParams] = useSearchParams();
  const showtimeId = searchParams.get("showtimeId");

  // Lấy state từ Layout
  const { selectedSeats, setSelectedSeats } = useOutletContext<any>();

  const { data, isLoading } = useQuery({
    queryKey: ["showtime-seats", showtimeId],
    queryFn: async () => {
      const { data } = await axios.get<{
        showTime: any;
        seats: IShowTimeSeat[];
      }>(`${API.SHOWTIME}/${showtimeId}`);
      return data;
    },
    enabled: !!showtimeId,
  });

  const seats = data?.seats || [];

  const toggleSeat = (seat: IShowTimeSeat) => {
    if (seat.trang_thai !== "empty") return;

    setSelectedSeats((prev: IShowTimeSeat[]) => {
      const isExist = prev.find((s) => s.seatCode === seat.seatCode);
      if (isExist) {
        return prev.filter((s) => s.seatCode !== seat.seatCode);
      }
      return [...prev, seat];
    });
  };

  const seatsByRow = seats.reduce(
    (acc, seat) => {
      (acc[seat.row] = acc[seat.row] || []).push(seat);
      acc[seat.row].sort((a, b) => a.number - b.number);
      return acc;
    },
    {} as Record<string, IShowTimeSeat[]>,
  );

  const sortedRows = Object.keys(seatsByRow).sort();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spin tip="Loading Seats..." />
      </div>
    );

  return (
    <div className="pb-32">
      {" "}
      {/* Padding bottom để chừa chỗ cho footer của layout */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-10 border border-white/5">
        {/* SCREEN */}
        <div className="mb-16 relative">
          <div className="h-2 w-full bg-primary/40 rounded-full blur-sm" />
          <div className="h-1 w-full bg-primary/60 rounded-full mt-1" />
          <p className="text-center text-[10px] tracking-[0.3em] text-zinc-500 mt-4 uppercase font-black">
            Screen
          </p>
        </div>

        {/* SEATS GRID */}
        <div className="space-y-4">
          {sortedRows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-3">
              <div className="w-6 text-[10px] text-zinc-600 font-black">
                {row}
              </div>
              {seatsByRow[row].map((seat) => {
                const isSelected = selectedSeats.some(
                  (s: any) => s.seatCode === seat.seatCode,
                );
                const isOccupied = seat.trang_thai !== "empty";

                let seatClass =
                  "bg-white/5 border-white/10 hover:bg-white/10 text-white/40";
                if (isOccupied)
                  seatClass = "bg-white/5 opacity-20 cursor-not-allowed";
                if (isSelected)
                  seatClass =
                    "bg-primary border-primary text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]";

                const isVip = seat.loai_ghe === "vip";

                return (
                  <button
                    key={seat.seatCode}
                    onClick={() => toggleSeat(seat)}
                    disabled={isOccupied}
                    className={`w-10 h-10 text-[11px] font-bold flex items-center justify-center border transition-all duration-300 ${seatClass} ${isVip ? "rounded-xl" : "rounded-full"}`}
                  >
                    {seat.number}
                  </button>
                );
              })}
              <div className="w-6 text-[10px] text-zinc-600 font-black">
                {row}
              </div>
            </div>
          ))}
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white/10 rounded-full" /> Available
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white/10 opacity-20 rounded-full" />{" "}
            Booked
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full" /> Selected
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 border border-white/20 rounded-md" /> VIP
          </div>
        </div>
      </div>
    </div>
  );
}
