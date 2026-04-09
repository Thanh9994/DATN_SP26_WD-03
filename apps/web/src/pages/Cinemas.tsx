import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCinemas } from '@web/hooks/useCinema';
import type { ICinema } from '@shared/src/schemas';

const filterTabs = ['TAT CA', 'IMAX', '4DX', 'VIP'];

export default function Cinemas() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const navigate = useNavigate();

  const { cinemas = [], isLoading } = useCinemas();

  const cities = useMemo(() => {
    const cityMap = new Map<string, number>();

    cinemas.forEach((cinema: ICinema) => {
      const cityName = cinema.city?.trim() || 'Khac';
      cityMap.set(cityName, (cityMap.get(cityName) || 0) + 1);
    });

    return Array.from(cityMap.entries()).map(([name, cinemaCount], index) => ({
      id: index + 1,
      name,
      cinemas: cinemaCount,
    }));
  }, [cinemas]);

  const activeCity = selectedCity || cities[0]?.name || '';

  const filteredCinemas = useMemo(() => {
    if (!activeCity) return cinemas;
    return cinemas.filter((cinema: ICinema) => cinema.city === activeCity);
  }, [cinemas, activeCity]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <div
          onClick={() => setOpenSidebar(false)}
          className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            openSidebar ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        />

        <aside
          className={`fixed top-0 left-0 z-40 h-full w-[280px] border-r border-white/10 bg-[#0a0103] px-6 py-10
          transform-gpu transition-transform duration-300 ease-out
          ${openSidebar ? 'translate-x-0' : '-translate-x-full'}
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
            {cities.map((city) => {
              const isActive = city.name === activeCity;

              return (
                <button
                  key={city.name}
                  onClick={() => {
                    setSelectedCity(city.name);
                    setOpenSidebar(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-full border px-4 py-3 text-left transition hover:scale-[1.02]
                  ${
                    isActive
                      ? 'border-red-500 bg-red-500'
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>📍</span>
                    <div>
                      <div className="font-semibold">{city.name}</div>
                      <div className="text-xs text-white/50">{city.cinemas} Cinemas</div>
                    </div>
                  </div>
                  ›
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl md:text-5xl">
                Cinemas In <br /> {activeCity || 'Your City'}
              </h1>
              <p className="text-sm text-white/50 sm:text-base">
                Discover premium movie experiences near you.
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {filterTabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-full px-5 py-2 text-sm font-medium ${
                    index === 0 ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {isLoading ? (
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center"
                >
                  <div className="h-[150px] w-full rounded-xl bg-white/10 md:w-[220px]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-1/2 rounded bg-white/10" />
                    <div className="h-4 w-2/3 rounded bg-white/10" />
                    <div className="h-4 w-1/3 rounded bg-white/10" />
                  </div>
                  <div className="h-10 w-24 rounded-full bg-white/10" />
                </div>
              ))
            ) : filteredCinemas.length > 0 ? (
              filteredCinemas.map((cinema: ICinema) => (
                <div
                  key={cinema._id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 md:flex-row md:items-center"
                >
                  <div className="flex h-[150px] w-full items-center justify-center rounded-xl bg-gradient-to-br from-red-950 to-zinc-900 text-5xl md:w-[220px]">
                    🎬
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{cinema.name}</h3>
                    <p className="text-sm text-white/50">{cinema.address}</p>

                    <div className="mt-3 flex flex-wrap gap-6 text-sm text-white/80">
                      <span>📍 {cinema.city}</span>
                      <span>🏢 {cinema.danh_sach_phong?.length || 0} rooms</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/cinemadetail/${cinema._id}`)}
                    className="rounded-full bg-red-500 px-5 py-2 text-sm font-bold transition hover:bg-red-400"
                  >
                    View →
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
                No cinemas found in this city.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}