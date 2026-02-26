import { useMemo, useState } from "react";

type SeatType = "standard" | "premium" | "vip";
type SeatStatus = "available" | "occupied";

type Seat = {
  id: string;
  row: string;
  col: number;
  type: SeatType;
  status: SeatStatus;
};

const PRICE: Record<SeatType, number> = {
  standard: 18.5,
  premium: 22,
  vip: 35,
};

const formatMoney = (n: number) =>
  `$${n.toFixed(2)}`;

function createSeats(): Seat[] {
  const data: Seat[] = [];

  const blocks = [
    { type: "standard" as SeatType, rows: ["A", "B"], cols: 10 },
    { type: "premium" as SeatType, rows: ["F", "G", "H"], cols: 12 },
    { type: "vip" as SeatType, rows: ["J"], cols: 4 },
  ];

  for (const block of blocks) {
    for (const row of block.rows) {
      for (let i = 1; i <= block.cols; i++) {
        const id = `${row}${i}`;
        data.push({
          id,
          row,
          col: i,
          type: block.type,
          status: Math.random() < 0.1 ? "occupied" : "available",
        });
      }
    }
  }

  return data;
}

export default function SeatBooking() {
  const seats = useMemo(() => createSeats(), []);
  const [selected, setSelected] = useState<Set<string>>(new Set(["G10", "G11"]));

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "occupied") return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(seat.id) ? next.delete(seat.id) : next.add(seat.id);
      return next;
    });
  };

  const selectedSeats = seats.filter((s) => selected.has(s.id));

  const total = selectedSeats.reduce(
    (sum, s) => sum + PRICE[s.type],
    0
  );

  return (
    <div className="min-h-screen mx-auto bg-[#07070b] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

        {/* LEFT MOVIE CARD */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-zinc-900 p-4 border border-white/10">
            <div className="h-[420px] rounded-2xl bg-gradient-to-br from-cyan-600 to-orange-500" />
            <h2 className="text-2xl font-bold mt-4">Dune: Part Two</h2>

            <div className="flex gap-2 mt-2 text-sm text-zinc-400">
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                ★ 4.8
              </span>
              <span className="bg-white/10 px-2 py-1 rounded-full">IMAX 2D</span>
              <span className="bg-white/10 px-2 py-1 rounded-full">PG-13</span>
            </div>

            <div className="mt-6 bg-zinc-800 p-4 rounded-2xl text-sm">
              <p className="text-zinc-400">SHOWTIME DETAILS</p>
              <p className="font-semibold mt-2">Grand Cinema, Downtown</p>
              <p className="text-zinc-400">Screen 04, Floor 4</p>
              <p className="mt-3 text-zinc-300">
                Today, 24 Oct 2024 — 12:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* SEAT AREA */}
        <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10">

          {/* SCREEN */}
          <div className="mb-10 relative">
            <div className="h-12 w-full rounded-t-full bg-red-600/20 border border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]" />
            <p className="text-center text-xs tracking-widest text-zinc-400 mt-2">
              SCREEN THIS WAY
            </p>
          </div>

          {/* SEATS */}
          <div className="space-y-6">
            {["A", "B", "F", "G", "H", "J"].map((row) => {
              const rowSeats = seats.filter((s) => s.row === row);
              return (
                <div key={row} className="flex items-center justify-center gap-2">
                  {rowSeats.map((seat) => {
                    const isSelected = selected.has(seat.id);
                    const isOccupied = seat.status === "occupied";

                    return (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat)}
                        disabled={isOccupied}
                        className={`w-9 h-9 rounded-full text-xs flex items-center justify-center border transition
                        ${
                          isOccupied
                            ? "bg-zinc-700 text-zinc-500 border-zinc-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-red-600 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                            : "bg-zinc-800 border-zinc-600 hover:bg-zinc-700"
                        }`}
                      >
                        {seat.col}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* LEGEND */}
          <div className="flex justify-center gap-8 mt-10 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-zinc-800 rounded" />
              Available
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-zinc-700 rounded" />
              Occupied
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded" />
              Selected
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-10 py-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">SELECTED SEATS</p>
          <p className="text-lg font-semibold">
            {selectedSeats.map((s) => s.id).join(", ")}
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-zinc-400">ESTIMATED PRICE</p>
          <p className="text-2xl font-bold">{formatMoney(total)}</p>
        </div>

        <button className="bg-red-600 px-8 py-3 rounded-xl font-semibold hover:bg-red-500 transition">
          Confirm Booking →
        </button>
      </div>
    </div>
  );
}