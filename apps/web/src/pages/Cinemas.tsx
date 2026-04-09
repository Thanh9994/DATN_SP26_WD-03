import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCinemas } from '@web/hooks/useCinema';
import { API } from '@web/api/api.service';
import type { ICinema } from '@shared/src/schemas';
import { MapPin, Building2, Film, ChevronRight, Menu, X, Loader } from 'lucide-react';

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
        {/* Overlay */}
        <div
          onClick={() => setOpenSidebar(false)}
          className={`fixed inset-0 z-30 bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            openSidebar ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        />

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-full w-[280px] border-r border-red-950/30 bg-black px-6 py-10
          transform-gpu transition-transform duration-300 ease-out
          ${openSidebar ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0`}
        >
          <button
            onClick={() => setOpenSidebar(false)}
            className="absolute right-4 top-4 text-2xl text-gray-600 hover:text-gray-400 transition lg:hidden"
          >
            <X size={24} />
          </button>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={20} className="text-red-700" />
              <h2 className="text-lg font-bold tracking-wide">KHU VỰC</h2>
            </div>
            <p className="mt-2 text-xs text-gray-600">Chọn thành phố của bạn</p>
          </div>

          <div className="space-y-2">
            {cities.map((city) => {
              const isActive = city.name === activeCity;

              return (
                <button
                  key={city.name}
                  onClick={() => {
                    setSelectedCity(city.name);
                    setOpenSidebar(false);
                  }}
                  className={`w-full rounded-lg border transition-all duration-200 px-4 py-3 text-left group ${
                    isActive
                      ? 'border-red-900/60 bg-red-950/30'
                      : 'border-red-950/20 bg-transparent hover:border-red-900/40 hover:bg-red-950/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📍</span>
                      <div>
                        <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {city.name}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-red-600' : 'text-gray-700'}`}>
                          {city.cinemas} rạp
                        </div>
                      </div>
                    </div>
                    {isActive && <ChevronRight size={16} className="text-red-700" />}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
          {/* Mobile Menu Button */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setOpenSidebar(true)}
              className="flex items-center gap-2 rounded-lg border border-red-950/40 bg-red-950/20 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-red-950/30 transition-all"
            >
              <Menu size={18} />
              Chọn khu vực
            </button>
          </div>

          {/* Header Section */}
          <div className="mb-12 space-y-8">
            <div className="rounded-xl border border-red-950/40 bg-gradient-to-br from-red-950/40 via-red-950/20 to-black p-10 md:p-12">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-red-700">Khám phá rạp chiếu</p>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                  Rạp chiếu tại {activeCity || 'khu vực của bạn'}
                </h1>
                <p className="text-sm text-gray-500 max-w-2xl">
                  Trải nghiệm điện ảnh cao cấp gần bạn nhất với những phòng chiếu hiện đại.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedRoomType(tab)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                      selectedRoomType === tab
                        ? 'border-red-900/60 bg-red-950/40 text-white'
                        : 'border-red-950/20 bg-transparent text-gray-500 hover:border-red-900/40 hover:bg-red-950/20 hover:text-gray-400'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {selectedRoomType !== 'TẤT CẢ' && (
                <div className="flex items-center gap-2 rounded-lg border border-red-950/40 bg-red-950/20 px-4 py-2">
                  <Film size={14} className="text-red-700" />
                  <span className="text-sm text-gray-400">
                    Lọc: <span className="text-red-600 font-medium">{selectedRoomType}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cinemas List */}
          <div className="space-y-6">
            {isLoading || roomsLoading ? (
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse flex-col gap-4 rounded-lg border border-red-950/30 bg-red-950/15 p-6 md:flex-row md:items-center"
                >
                  <div className="h-[160px] w-full rounded-lg bg-red-950/30 md:w-[240px] flex items-center justify-center">
                    <Loader size={32} className="text-red-900/50 animate-spin" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 w-1/2 rounded bg-red-950/30" />
                    <div className="h-4 w-2/3 rounded bg-red-950/20" />
                    <div className="flex gap-3">
                      <div className="h-7 w-24 rounded-full bg-red-950/25" />
                      <div className="h-7 w-28 rounded-full bg-red-950/25" />
                    </div>
                  </div>
                  <div className="h-11 w-28 rounded bg-red-950/30" />
                </div>
              ))
            ) : filteredCinemas.length > 0 ? (
              filteredCinemas.map((cinema: ICinema) => {
                const cinemaRooms = getCinemaRooms(cinema._id);
                const roomTypeSummary = getRoomTypeSummary(cinema._id);

                return (
                  <div
                    key={cinema._id || Math.random()}
                    className="group rounded-lg border border-red-950/30 bg-red-950/15 p-6 transition-all duration-300 hover:border-red-900/50 hover:bg-red-950/25 md:flex md:items-center md:gap-6"
                  >
                    {/* Cinema Image */}
                    <div className="mb-5 md:mb-0 flex h-[160px] w-full items-center justify-center rounded-lg bg-red-950/40 text-5xl md:w-[240px] flex-shrink-0">
                      🎬
                    </div>

                    {/* Cinema Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                          {cinema.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{cinema.address}</p>
                      </div>

                      {/* Cinema Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-red-700" />
                          <span>{cinema.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-red-700" />
                          <span>{cinemaRooms.length} phòng</span>
                        </div>

                        {selectedRoomType !== 'TẤT CẢ' && (
                          <div className="flex items-center gap-2">
                            <Film size={14} className="text-red-700" />
                            <span>
                              {selectedRoomType}: {getRoomTypeCount(cinema._id, selectedRoomType)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Room Type Badges */}
                      {roomTypeSummary.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {roomTypeSummary.map(([type, count]) => (
                            <span
                              key={type}
                              className="rounded-full border border-red-950/40 bg-red-950/25 px-3 py-1 text-xs font-medium text-gray-500 hover:border-red-900/60 hover:bg-red-950/35 transition-all"
                            >
                              {type}: {count}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!cinema._id) return;
                        navigate(`/cinemadetail/${cinema._id}`);
                      }}
                      className="mt-5 md:mt-0 w-full md:w-auto rounded-lg bg-red-700 px-6 py-3 font-bold text-white transition-all duration-200 hover:bg-red-600 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      Xem chi tiết
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-red-950/30 bg-red-950/15 p-12 text-center">
                <Film size={48} className="mx-auto mb-3 text-red-950" />
                <p className="text-gray-600">Không tìm thấy rạp phù hợp trong khu vực này.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}