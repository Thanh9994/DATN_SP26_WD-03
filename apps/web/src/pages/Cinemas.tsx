
const cities = [
  { name: "Metropolis", cinemas: 12, active: true },
  { name: "Gotham City", cinemas: 8, active: false },
  { name: "Star City", cinemas: 5, active: false },
  { name: "Central City", cinemas: 9, active: false },
  { name: "Coast City", cinemas: 4, active: false },
];

const cinemas = [
  {
    name: "CineStream Grand Plaza",
    address: "123 Luxury Avenue, Metropolis Downtown, 54001",
    distance: "1.2 KM",
    price: "$14.00",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1560109947-543149eceb16?auto=format&fit=crop&w=800&q=80",
    amenities: ["🏠", "🎯", "🛋️"],
    highlight: true,
  },
  {
    name: "CineStream Northside Hub",
    address: "456 Skyline Blvd, Metropolis North, 54005",
    distance: "4.8 KM",
    price: "$12.50",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=800&q=80",
    amenities: ["🎯", "🛋️"],
    highlight: false,
  },
  {
    name: "CineStream Boutique - Old Town",
    address: "88 Heritage Square, Metropolis Old Quarter, 54002",
    distance: "2.5 KM",
    price: "$18.00",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    amenities: ["🛋️", "🍴"],
    highlight: false,
  },
];

const filterTabs = ["ALL", "IMAX", "4DX", "VIP"];

export default function Cinemas() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar */}
        <aside className="w-[320px] border-r border-white/10 bg-[#0a0103] px-6 py-10">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight">LOCATIONS</h2>
            <p className="mt-2 text-sm text-white/50">Select your current city</p>
          </div>

          <div className="space-y-5">
            {cities.map((city) => (
              <button
                key={city.name}
                className={`group flex w-full items-center justify-between rounded-full border px-5 py-4 text-left transition-all ${
                  city.active
                    ? "border-red-500 bg-red-500 shadow-[0_0_30px_rgba(255,59,59,0.35)]"
                    : "border-transparent bg-transparent hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      city.active ? "bg-white/10" : "bg-white/5"
                    }`}
                  >
                    <span className="text-lg">📍</span>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{city.name}</div>
                    <div
                      className={`text-sm ${
                        city.active ? "text-white/80" : "text-white/40"
                      }`}
                    >
                      {city.cinemas} Premium Cinemas
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xl transition ${
                    city.active ? "text-white" : "text-white/30 group-hover:text-white/60"
                  }`}
                >
                  ›
                </span>
              </button>
            ))}
          </div>

          <div className="mt-14 border-t border-white/10 pt-8">
            <button className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-6 py-4 text-lg font-medium text-white/70 transition hover:bg-white/5 hover:text-white">
              <span>🌐</span>
              Change Country
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-[radial-gradient(circle_at_top_right,rgba(120,20,20,0.15),transparent_25%),linear-gradient(to_bottom,#0b0102,#120304)] px-8 py-10 lg:px-10 xl:px-12">
          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="max-w-[500px] text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
                Cinemas In <br /> Metropolis
              </h1>
              <p className="mt-4 text-2xl text-white/45">
                Discover premium movie experiences near you.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:pt-6">
              {filterTabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-full border px-6 py-3 text-sm font-bold tracking-wide transition ${
                    index === 0
                      ? "border-red-500 bg-red-500 text-white shadow-[0_0_25px_rgba(255,59,59,0.35)]"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cinema cards */}
          <div className="mt-10 space-y-6">
            {cinemas.map((cinema) => (
              <div
                key={cinema.name}
                className="flex flex-col gap-6 rounded-[34px] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-center">
                  <div className="relative h-[130px] w-full overflow-hidden rounded-[28px] md:w-[220px]">
                    <img
                      src={cinema.image}
                      alt={cinema.name}
                      className="h-full w-full object-cover"
                    />
                    {cinema.featured && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-red-500 px-3 py-1 text-xs font-extrabold tracking-widest text-white">
                        FEATURED
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-extrabold">{cinema.name}</h3>
                    <p className="mt-2 text-lg text-white/50">{cinema.address}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                      {cinema.amenities.map((item, i) => (
                        <span
                          key={i}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-400"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex gap-10">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-white/30">
                          Distance
                        </div>
                        <div className="mt-1 text-2xl font-bold">{cinema.distance}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-white/30">
                          Price From
                        </div>
                        <div className="mt-1 text-2xl font-bold">{cinema.price}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <button
                    className={`rounded-full px-8 py-4 text-lg font-extrabold transition ${
                      cinema.highlight
                        ? "bg-red-500 text-white shadow-[0_0_30px_rgba(255,59,59,0.35)] hover:bg-red-400"
                        : "border border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
                    }`}
                  >
                    VIEW DETAILS →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Map CTA */}
          <div className="mt-10 grid gap-8 rounded-[36px] border border-white/10 bg-white/[0.03] p-8 md:grid-cols-[1.4fr_320px] md:items-center">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">
                Prefer a map view?
              </h2>
              <p className="mt-4 max-w-[620px] text-xl leading-relaxed text-white/45">
                See all locations on an interactive map for easy navigation and
                real-time updates.
              </p>

              <button className="mt-8 rounded-full bg-white px-8 py-5 text-base font-extrabold tracking-widest text-black transition hover:scale-[1.02]">
                OPEN INTERACTIVE MAP
              </button>
            </div>

            <div className="mx-auto flex h-[240px] w-[240px] items-center justify-center rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] md:ml-auto md:h-[260px] md:w-[260px]">
              <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%),linear-gradient(to_bottom,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%)] opacity-50" />
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500/20">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm">
                    📍
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}