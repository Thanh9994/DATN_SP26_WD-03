import { useState } from "react";

type DateItem = {
  day: string;
  dow: string;
  month: string;
};

type FormatTag =
  | "STANDARD 2D"
  | "DOLBY ATMOS 7.1"
  | "IMAX 3D EXPERIENCE"
  | "HIGH FIDELITY LASER";

type Cinema = {
  id: string;
  name: string;
  distanceKm: number;
  location: string;
  tags: FormatTag[];
  showtimes: string[];
};

const dates: DateItem[] = [
  { month: "OCTOBER", day: "24", dow: "TODAY" },
  { month: "OCTOBER", day: "25", dow: "FRIDAY" },
  { month: "OCTOBER", day: "26", dow: "SATURDAY" },
  { month: "OCTOBER", day: "27", dow: "SUNDAY" },
  { month: "OCTOBER", day: "28", dow: "MONDAY" },
  { month: "OCTOBER", day: "29", dow: "TUESDAY" },
];

const cinemas: Cinema[] = [
  {
    id: "grand",
    name: "Grand Cinema, Downtown",
    distanceKm: 2.4,
    location: "4th Floor, City Plaza",
    tags: [
      "STANDARD 2D",
      "DOLBY ATMOS 7.1",
      "IMAX 3D EXPERIENCE",
      "HIGH FIDELITY LASER",
    ],
    showtimes: ["10:00 AM", "01:30 PM", "04:45 PM", "12:00 PM", "03:30 PM", "07:00 PM"],
  },
  {
    id: "cineplex",
    name: "Cineplex Star – Avenue",
    distanceKm: 4.8,
    location: "Mall Wing, South Entrance",
    tags: ["STANDARD 2D", "DOLBY ATMOS 7.1"],
    showtimes: ["09:30 AM", "12:30 PM", "03:15 PM", "06:10 PM", "09:05 PM"],
  },
  {
    id: "starlight",
    name: "Starlight Premium 4DX",
    distanceKm: 6.1,
    location: "Garden City Lifestyle Mall",
    tags: ["IMAX 3D EXPERIENCE", "HIGH FIDELITY LASER"],
    showtimes: ["11:10 AM", "02:20 PM", "05:40 PM", "08:30 PM"],
  },
];

const chipBase =
  "rounded-2xl px-4 py-3 text-sm border transition select-none";

const glowRed = "shadow-[0_0_40px_rgba(239,68,68,0.25)]";

function TagPill({ active, children }: { active?: boolean; children: string }) {
  return (
    <span
      className={[
        "text-[10px] tracking-widest uppercase",
        active ? "text-red-400" : "text-zinc-500",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function Showtime() {
  const [activeDate, setActiveDate] = useState(0);
  const [openCinemaId, setOpenCinemaId] = useState<string>("grand");
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("grand");
  const [selectedTime, setSelectedTime] = useState<string>("12:00 PM");

  const estimatedPrice = 18.5;

  
  const handleSelectSeats = () => {
    const selectedCinema = cinemas.find((c) => c.id === selectedCinemaId) ?? cinemas[0];
    alert(`Selected: ${selectedCinema.name} • ${selectedTime}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white/90" />
            </div>
            <div className="font-semibold tracking-wide">CINESTREAM</div>
            <nav className="ml-6 hidden gap-6 text-xs text-zinc-400 md:flex">
              <span className="cursor-pointer hover:text-white">Movies</span>
              <span className="cursor-pointer hover:text-white">Cinemas</span>
              <span className="cursor-pointer hover:text-white">Offers</span>
              <span className="cursor-pointer hover:text-white">My Tickets</span>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <button className="h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10" />
            <button className="h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 relative">
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="h-9 w-9 rounded-full bg-emerald-200/80" />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* LEFT MOVIE CARD */}
        <aside className="space-y-5">
          <div className="rounded-[28px] bg-white/5 border border-white/10 p-4">
            <div className="relative overflow-hidden rounded-3xl h-[420px] bg-gradient-to-br from-cyan-700/50 to-orange-600/60">
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-[10px] font-semibold tracking-widest">
                TRENDING #1
              </div>

              <div className="absolute left-5 bottom-16 right-5">
                <div className="text-4xl font-extrabold leading-[1.05] drop-shadow">
                  Dune:
                  <br />
                  Part Two
                </div>
              </div>
              <div className="absolute left-5 bottom-6 flex items-center gap-2 text-xs text-zinc-200/90">
                <span className="rounded-full bg-yellow-500/15 px-2 py-1 text-yellow-300">★ 4.8</span>
                <span className="rounded-full bg-white/10 px-2 py-1">Sci-Fi / Adventure</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
              <span>2h 46m</span>
              <span className="rounded-full bg-white/10 px-3 py-1">IMAX</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-2xl border border-white/10 bg-white/5 py-3 text-sm hover:bg-white/10 transition">
                Trailer
              </button>
              <button className="rounded-2xl border border-white/10 bg-white/5 py-3 text-sm hover:bg-white/10 transition">
                Share
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="space-y-6">
          {/* SELECT DATE */}
          <section className="rounded-[28px] bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="text-[11px] tracking-[0.35em] text-zinc-400 font-semibold">
                SELECT DATE
              </div>
              <div className="flex gap-2">
                <button className="h-8 w-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10" />
                <button className="h-8 w-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {dates.map((d, idx) => {
                const active = idx === activeDate;
                return (
                  <button
                    key={`${d.day}-${idx}`}
                    onClick={() => setActiveDate(idx)}
                    className={[
                      "w-[86px] rounded-2xl border px-4 py-4 text-left transition",
                      active
                        ? `bg-red-600 border-red-500 ${glowRed}`
                        : "bg-white/5 border-white/10 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <div className="text-[10px] tracking-widest text-white/80">{d.month}</div>
                    <div className="text-3xl font-extrabold leading-none mt-1">{d.day}</div>
                    <div className="text-[10px] tracking-widest text-white/80 mt-2">{d.dow}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CINEMA LOCATIONS */}
          <section className="rounded-[28px] bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="text-[11px] tracking-[0.35em] text-zinc-400 font-semibold">
                CINEMA LOCATIONS
              </div>
              <button className="text-[10px] tracking-widest text-red-400 hover:text-red-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                ADVANCED FILTERS
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {cinemas.map((c) => {
                const open = openCinemaId === c.id;
                const isSelectedCinema = selectedCinemaId === c.id;

                return (
                  <div
                    key={c.id}
                    className={[
                      "rounded-[22px] border bg-black/25 overflow-hidden transition",
                      open
                        ? "border-red-500/30 shadow-[0_0_55px_rgba(239,68,68,0.10)]"
                        : "border-white/10",
                    ].join(" ")}
                  >
                    <button
                      className="w-full px-5 py-4 flex items-center justify-between"
                      onClick={() => setOpenCinemaId(open ? "" : c.id)}
                      type="button"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={[
                            "h-10 w-10 rounded-2xl border flex items-center justify-center",
                            open ? "border-red-500/40 bg-red-500/10" : "border-white/10 bg-white/5",
                          ].join(" ")}
                        >
                          <div className="h-4 w-4 rounded bg-white/20" />
                        </div>

                        <div className="text-left">
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-xs text-zinc-400 mt-1">
                            {c.distanceKm.toFixed(1)} km away{" "}
                            <span className="mx-2 text-zinc-600">•</span> {c.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCinemaId(c.id);
                            setOpenCinemaId(c.id);
                          }}
                          className={[
                            "h-8 px-3 rounded-full text-xs border transition",
                            isSelectedCinema
                              ? "border-red-500/50 bg-red-500/10 text-red-200"
                              : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {isSelectedCinema ? "Selected" : "Select"}
                        </button>

                        <div
                          className={[
                            "h-8 w-8 rounded-full border bg-white/5 flex items-center justify-center transition",
                            open ? "border-red-500/40 text-red-300" : "border-white/10 text-zinc-300",
                          ].join(" ")}
                        >
                          <span className="text-lg leading-none">{open ? "˄" : "˅"}</span>
                        </div>
                      </div>
                    </button>

                    {open && (
                      <div className="px-5 pb-5">
                        <div className="flex flex-wrap gap-4 px-1 pb-3">
                          <TagPill active={c.tags.includes("STANDARD 2D")}>STANDARD 2D</TagPill>
                          <TagPill active={c.tags.includes("DOLBY ATMOS 7.1")}>Dolby Atmos 7.1</TagPill>
                          <TagPill active={c.tags.includes("IMAX 3D EXPERIENCE")}>IMAX 3D EXPERIENCE</TagPill>
                          <TagPill active={c.tags.includes("HIGH FIDELITY LASER")}>High Fidelity Laser</TagPill>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {c.showtimes.map((t) => {
                            const active = selectedCinemaId === c.id && selectedTime === t;
                            return (
                              <button
                                key={t}
                                className={[
                                  chipBase,
                                  "min-w-[92px] text-center",
                                  active
                                    ? `bg-red-600 border-red-500 ${glowRed}`
                                    : "bg-white/5 border-white/10 hover:bg-white/10 text-zinc-200",
                                ].join(" ")}
                                onClick={() => {
                                  setSelectedCinemaId(c.id);
                                  setSelectedTime(t);
                                }}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] tracking-[0.35em] text-zinc-400 font-semibold">
                CURRENT SHOW
              </div>
              <div className="mt-1 font-semibold">
                IMAX • {selectedTime}{" "}
                <span className="ml-2 text-[10px] tracking-widest text-red-400">SELECTED</span>
              </div>
            </div>

            <div className="hidden md:block h-10 w-px bg-white/10" />

            <div>
              <div className="text-[10px] tracking-[0.35em] text-zinc-400 font-semibold">
                ESTIMATED PRICE
              </div>
              <div className="mt-1 font-semibold">
                ${estimatedPrice.toFixed(2)}{" "}
                <span className="text-xs text-zinc-400 font-normal">/ SEAT</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition" />
            <button className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition" />
            <button
              className={[
                "h-12 px-8 rounded-2xl font-semibold bg-red-600 hover:bg-red-500 transition flex items-center gap-2",
                glowRed,
              ].join(" ")}
              type="button"
              onClick={handleSelectSeats}
            >
              Select Seats <span className="text-lg">↦</span>
            </button>
          </div>
        </div>
      </div>

      <div className="h-28" />
    </div>
  );
}