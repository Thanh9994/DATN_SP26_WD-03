import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCinemas } from '@web/hooks/useCinema';
import { API } from '@web/api/api.service';
import type { ICinema } from '@shared/src/schemas';

interface ICinemaRef {
  _id: string;
  name?: string;
  city?: string;
  address?: string;
}

interface IRoomRow {
  name: string;
  seats: number;
}

interface IRoom {
  _id: string;
  cinema_id: string | ICinemaRef;
  ten_phong: string;
  loai_phong?: string;
  rows: IRoomRow[];
  vip?: string[];
  couple?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_TABS = ['TẤT CẢ', 'IMAX', '4DX', 'VIP'];

export default function Cinemas() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('TẤT CẢ');
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const navigate = useNavigate();
  const { cinemas = [], isLoading } = useCinemas();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setRoomsLoading(true);
        const { data } = await axios.get(API.ROOMS);
        setRooms(data?.data || []);
      } catch (error) {
        console.error('Lỗi lấy danh sách phòng:', error);
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const cities = useMemo(() => {
    const cityMap = new Map<string, number>();

    cinemas.forEach((cinema: ICinema) => {
      const cityName = (cinema.city ?? '').trim() || 'Khác';
      cityMap.set(cityName, (cityMap.get(cityName) || 0) + 1);
    });

    return Array.from(cityMap.entries()).map(([name, cinemaCount], index) => ({
      id: index + 1,
      name,
      cinemas: cinemaCount,
    }));
  }, [cinemas]);

  const activeCity = selectedCity || cities[0]?.name || '';

  const roomsByCinema = useMemo(() => {
    const map = new Map<string, IRoom[]>();

    rooms.forEach((room) => {
      const cinemaId =
        typeof room.cinema_id === 'string' ? room.cinema_id : room.cinema_id?._id || '';

      if (!cinemaId) return;

      if (!map.has(cinemaId)) {
        map.set(cinemaId, []);
      }

      map.get(cinemaId)?.push(room);
    });

    return map;
  }, [rooms]);

  const filterTabs = useMemo(() => {
    const apiRoomTypes = Array.from(
      new Set(
        rooms
          .map((room) => room.loai_phong?.trim())
          .filter((type): type is string => Boolean(type)),
      ),
    );

    return Array.from(new Set(['TẤT CẢ', ...DEFAULT_TABS.slice(1), ...apiRoomTypes]));
  }, [rooms]);

  const filteredCinemas = useMemo(() => {
    let result = cinemas;

    if (activeCity) {
      result = result.filter((cinema: ICinema) => cinema.city === activeCity);
    }

    if (selectedRoomType !== 'TẤT CẢ') {
      result = result.filter((cinema: ICinema) => {
        if (!cinema._id) return false;
        const cinemaRooms = roomsByCinema.get(cinema._id) || [];
        return cinemaRooms.some((room) => room.loai_phong === selectedRoomType);
      });
    }

    return result;
  }, [cinemas, activeCity, selectedRoomType, roomsByCinema]);

  const getCinemaRooms = (cinemaId?: string) => {
    if (!cinemaId) return [];
    return roomsByCinema.get(cinemaId) || [];
  };

  const getRoomTypeCount = (cinemaId?: string, roomType?: string) => {
    if (!cinemaId || !roomType) return 0;
    const cinemaRooms = getCinemaRooms(cinemaId);
    return cinemaRooms.filter((room) => room.loai_phong === roomType).length;
  };

  const getRoomTypeSummary = (cinemaId?: string) => {
    const cinemaRooms = getCinemaRooms(cinemaId);

    const grouped = cinemaRooms.reduce<Record<string, number>>((acc, room) => {
      const type = room.loai_phong || 'Khác';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped);
  };

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
            <h2 className="text-2xl font-extrabold">KHU VỰC</h2>
            <p className="mt-2 text-sm text-white/50">Chọn thành phố của bạn</p>
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
                      <div className="text-xs text-white/50">{city.cinemas} rạp</div>
                    </div>
                  </div>
                  ›
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <button
              onClick={() => setOpenSidebar(true)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold"
            >
              ☰ Chọn khu vực
            </button>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl md:text-5xl">
                Rạp chiếu tại <br /> {activeCity || 'khu vực của bạn'}
              </h1>
              <p className="text-sm text-white/50 sm:text-base">
                Khám phá trải nghiệm điện ảnh cao cấp gần bạn.
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedRoomType(tab)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    selectedRoomType === tab
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 text-sm text-white/50">
            Bộ lọc hiện tại:
            <span className="ml-2 rounded-full bg-white/10 px-3 py-1 text-white">
              {selectedRoomType}
            </span>
          </div>

          <div className="mt-8 space-y-6">
            {isLoading || roomsLoading ? (
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
                    <div className="h-4 w-1/2 rounded bg-white/10" />
                  </div>
                  <div className="h-10 w-24 rounded-full bg-white/10" />
                </div>
              ))
            ) : filteredCinemas.length > 0 ? (
              filteredCinemas.map((cinema: ICinema) => {
                const cinemaRooms = getCinemaRooms(cinema._id);
                const roomTypeSummary = getRoomTypeSummary(cinema._id);

                return (
                  <div
                    key={cinema._id || Math.random()}
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
                        <span>🏢 {cinemaRooms.length} phòng</span>

                        {selectedRoomType !== 'TẤT CẢ' && (
                          <span>
                            🎞️ {selectedRoomType}: {getRoomTypeCount(cinema._id, selectedRoomType)}
                          </span>
                        )}
                      </div>

                      {roomTypeSummary.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {roomTypeSummary.map(([type, count]) => (
                            <span
                              key={type}
                              className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80"
                            >
                              {type}: {count}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (cinema._id) {
                          navigate(`/cinemadetail/${cinema._id}`);
                        }
                      }}
                      className="rounded-full bg-red-500 px-5 py-2 text-sm font-bold transition hover:bg-red-400"
                    >
                      Xem →
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
                Không tìm thấy rạp phù hợp trong khu vực này.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}