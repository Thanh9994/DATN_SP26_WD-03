import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cities = [
  { id: 1, name: "Metropolis", cinemas: 12, active: true },
  { id: 2, name: "Gotham City", cinemas: 8, active: false },
  { id: 3, name: "Star City", cinemas: 5, active: false },
  { id: 4, name: "Central City", cinemas: 9, active: false },
  { id: 5, name: "Coast City", cinemas: 4, active: false },
];

const cinemas = [
  {
    id: 1,
    name: "CineStream Grand Plaza",
    address: "123 Luxury Avenue, Metropolis Downtown",
    distance: "1.2 KM",
    price: "$14.00",
    image:
      "https://images.unsplash.com/photo-1560109947-543149eceb16?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "CineStream Northside Hub",
    address: "456 Skyline Blvd, Metropolis North",
    distance: "4.8 KM",
    price: "$12.50",
    image:
      "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=800&q=80",
  },
];

const filterTabs = ["ALL", "IMAX", "4DX", "VIP"];

export default function Cinemas() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">

        {/* Overlay */}
        <div
          onClick={() => setOpenSidebar(false)}
          className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden
          ${openSidebar ? "opacity-100 visible" : "opacity-0 invisible"}`}
        />

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-full w-[280px] bg-[#0a0103] border-r border-white/10 px-6 py-10
          transform-gpu transition-transform duration-300 ease-out
          ${openSidebar ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0`}
        >
          <button
            onClick={() => setOpenSidebar(false)}
            className="absolute right-4 top-4 text-xl lg:hidden"
          >
            ✕
          </button>

          <div className="mb-10">
            <h2 className="text-2xl font-extrabold">LOCATIONS</h2>
            <p className="mt-2 text-sm text-white/50">Select your city</p>
          </div>

          <div className="space-y-3">
            {cities.map((city) => (
              <button
                key={city.name}
                className={`flex w-full items-center justify-between rounded-full border px-4 py-3 text-left transition hover:scale-[1.02]
                ${
                  city.active
                    ? "border-red-500 bg-red-500"
                    : "border-transparent hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>📍</span>
                  <div>
                    <div className="font-semibold">{city.name}</div>
                    <div className="text-xs text-white/50">
                      {city.cinemas} Cinemas
                    </div>
                  </div>
                </div>
                ›
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">

          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl md:text-5xl">
                Cinemas In <br /> Metropolis
              </h1>
              <p className="text-sm text-white/50 sm:text-base">
                Discover premium movie experiences near you.
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {filterTabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-full px-5 py-2 text-sm font-medium
                  ${
                    index === 0
                      ? "bg-red-500 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cinema Cards */}
          <div className="mt-8 space-y-6">
            {cinemas.map((cinema) => (
              <div
                key={cinema.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 md:flex-row md:items-center"
              >
                <img
                  src={cinema.image}
                  alt={cinema.name}
                  className="h-[150px] w-full rounded-xl object-cover md:w-[220px]"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-bold">{cinema.name}</h3>
                  <p className="text-sm text-white/50">{cinema.address}</p>

                  <div className="mt-3 flex gap-6 text-sm text-white/80">
                    <span>{cinema.distance}</span>
                    <span>{cinema.price}</span>
                  </div>
                </div>

                {/* VIEW BUTTON */}
                <button
                  onClick={() => navigate(`/cinemadetail/${cinema.id}`)}
                  className="rounded-full bg-red-500 px-5 py-2 text-sm font-bold transition hover:bg-red-400"
                >
                  View →
                </button>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};
 
