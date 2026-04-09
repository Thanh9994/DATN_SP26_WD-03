import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Armchair,
  Camera,
  Clapperboard,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UtensilsCrossed,
  Volume2,
} from 'lucide-react';
import { useCinemas, useRooms } from '@web/hooks/useCinema';
import { useMovies } from '@web/hooks/useMovie';
import { useShowTime, type AdminShowtimeRow } from '@web/hooks/useShowTime';
import type { ICinema, IMovie, IPhong } from '@shared/src/schemas';

const fallbackHero =
  'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1600&q=80';

const galleryImages = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=900&q=80',
];

type CinemaRef = {
  _id?: string;
  name?: string;
  city?: string;
  address?: string;
};

type RoomWithCinema = IPhong & {
  cinema_id?: string | CinemaRef;
};

type CinemaShowtimeItem = {
  movieId: string;
  title: string;
  meta: string;
  poster?: string;
  times: string[];
};

const getCinemaIdFromRoom = (room: RoomWithCinema) => {
  const cinemaValue = room?.cinema_id;

  if (!cinemaValue) return undefined;

  if (typeof cinemaValue === 'string') {
    return cinemaValue;
  }

  return (cinemaValue as CinemaRef)._id;
};

const getRoomTypeLabel = (type?: string) => {
  if (!type) return 'Phòng tiêu chuẩn';

  const normalized = type.toUpperCase();

  if (normalized === 'IMAX') return 'IMAX';
  if (normalized === '4DX') return '4DX';
  if (normalized === 'VIP') return 'VIP';
  if (normalized === 'COUPLE') return 'Ghế đôi';

  return type;
};

const getMovieInfo = (
  movieId: AdminShowtimeRow['movieId'],
  movies: IMovie[],
): { id: string; title: string; duration: number; poster?: string } => {
  if (typeof movieId === 'object') {
    return {
      id: movieId._id || '',
      title: movieId.ten_phim || 'Không xác định',
      duration: movieId.thoi_luong || 0,
      poster: undefined,
    };
  }

  const movie = movies.find((item) => item._id === movieId);

  return {
    id: movie?._id || movieId,
    title: movie?.ten_phim || 'Không xác định',
    duration: movie?.thoi_luong || 0,
    poster: movie?.poster?.url,
  };
};

export default function CinemaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cinemas = [], isLoading: isCinemaLoading } = useCinemas();
  const { rooms = [], isLoading: isRoomLoading } = useRooms();
  const { movies = [], isLoading: isMovieLoading } = useMovies();
  const { showtimes = [], isLoading: isShowtimeLoading } = useShowTime();

  const cinema = useMemo(() => {
    return cinemas.find((item: ICinema) => item._id === id);
  }, [cinemas, id]);

  const cinemaRooms = useMemo(() => {
    if (!id) return [];
    return (rooms as RoomWithCinema[]).filter((room) => getCinemaIdFromRoom(room) === id);
  }, [rooms, id]);

  const amenityItems = useMemo(() => {
    const roomTypes = new Set<string>();
    let hasVipSeat = false;
    let hasCoupleSeat = false;

    cinemaRooms.forEach((room) => {
      if (room.loai_phong) roomTypes.add(room.loai_phong);
      if (room.vip?.length) hasVipSeat = true;
      if (room.couple?.length) hasCoupleSeat = true;
    });

    const items = [
      {
        icon: <Clapperboard size={18} />,
        label: `${cinemaRooms.length} PHÒNG CHIẾU`,
      },
      ...Array.from(roomTypes).map((type) => ({
        icon: <Camera size={18} />,
        label: getRoomTypeLabel(type).toUpperCase(),
      })),
    ];

    if (hasVipSeat) {
      items.push({
        icon: <Armchair size={18} />,
        label: 'GHẾ VIP',
      });
    }

    if (hasCoupleSeat) {
      items.push({
        icon: <Volume2 size={18} />,
        label: 'GHẾ ĐÔI',
      });
    }

    items.push({
      icon: <UtensilsCrossed size={18} />,
      label: 'BẮP NƯỚC',
    });

    return items.slice(0, 6);
  }, [cinemaRooms]);

  const todayShowtimes = useMemo(() => {
    if (!id) return [] as CinemaShowtimeItem[];

    const filtered = showtimes.filter((showtime) => {
      const showtimeRoomId =
        typeof showtime.roomId === 'string' ? showtime.roomId : showtime.roomId?._id;

      const room = cinemaRooms.find((item) => item._id === showtimeRoomId);
      if (!room) return false;

      return dayjs(showtime.startTime).isSame(dayjs(), 'day');
    });

    const grouped = new Map<string, CinemaShowtimeItem>();

    filtered.forEach((showtime) => {
      const movieInfo = getMovieInfo(showtime.movieId, movies as IMovie[]);
      const roomType =
        typeof showtime.roomId === 'object' ? showtime.roomId?.loai_phong : undefined;
      const timeText = dayjs(showtime.startTime).format('HH:mm');
      const key = movieInfo.id || `movie-${timeText}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          movieId: movieInfo.id,
          title: movieInfo.title,
          meta: `${movieInfo.duration ? `${movieInfo.duration} phút` : 'Đang cập nhật'} • ${
            roomType ? getRoomTypeLabel(roomType) : 'Suất chiếu'
          }`,
          poster:
            movieInfo.poster ||
            'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=300&q=80',
          times: [timeText],
        });
      } else {
        grouped.get(key)?.times.push(timeText);
      }
    });

    return Array.from(grouped.values()).map((item) => ({
      ...item,
      times: [...item.times].sort((a, b) => a.localeCompare(b)),
    }));
  }, [id, cinemaRooms, movies, showtimes]);

  const specialRoomCount = useMemo(() => {
    return cinemaRooms.filter((room) =>
      ['IMAX', '4DX', 'VIP', 'COUPLE'].includes((room.loai_phong || '').toUpperCase()),
    ).length;
  }, [cinemaRooms]);

  if (isCinemaLoading || isRoomLoading || isMovieLoading || isShowtimeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Đang tải thông tin rạp...
      </div>
    );
  }

  if (!cinema) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Không tìm thấy rạp phim.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0002] text-white">
      <div className="mx-auto max-w-[1600px]">
        <main className="px-4 pb-16 pt-4 md:px-8">
          <section className="relative overflow-hidden rounded-[26px] border border-white/10 md:rounded-[34px]">
            <img
              src={fallbackHero}
              alt={cinema.name}
              className="h-[260px] w-full object-cover md:h-[520px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0002] via-[#0b0002]/35 to-transparent" />

            <div className="absolute bottom-0 p-5 md:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff3b3b] md:text-xs">
                {cinema.city} • Hệ thống rạp hiện đại • Trải nghiệm điện ảnh
              </p>

              <h1 className="mt-2 text-3xl font-black md:text-7xl">{cinema.name}</h1>

              <p className="mt-2 max-w-[700px] text-sm text-white/75 md:text-xl">
                {cinema.address}. Khám phá hệ thống phòng chiếu hiện đại, lịch chiếu đa dạng và
                trải nghiệm xem phim chất lượng cao ngay hôm nay.
              </p>
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_420px]">
            <div>
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Camera size={18} className="text-[#ff3b3b]" />
                  <h2 className="text-lg font-extrabold uppercase md:text-[22px]">
                    Hình ảnh rạp
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {galleryImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`gallery-${i}`}
                      className="h-[180px] w-full rounded-2xl object-cover md:h-[250px]"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="mb-4 text-lg font-extrabold uppercase md:text-[22px]">
                  Tiện ích nổi bật
                </h2>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {amenityItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-5"
                    >
                      <div className="mb-2 text-[#ff3b3b]">{item.icon}</div>
                      <div className="text-xs font-bold uppercase">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="mb-5 text-lg font-extrabold uppercase md:text-[22px]">
                  Suất chiếu hôm nay
                </h2>

                <div className="space-y-5">
                  {todayShowtimes.length > 0 ? (
                    todayShowtimes.map((movie) => (
                      <div
                        key={movie.movieId}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-20 w-14 rounded-lg object-cover"
                          />

                          <div>
                            <h3 className="text-lg font-bold">{movie.title}</h3>
                            <p className="text-xs text-white/60">{movie.meta}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {movie.times.map((time) => (
                            <button
                              key={time}
                              type="button"
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                      Hôm nay chưa có suất chiếu nào tại rạp này.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-lg font-bold">Địa điểm & Liên hệ</h3>

                <div className="space-y-3 text-sm text-white/80">
                  <div className="flex gap-3">
                    <MapPin size={16} />
                    <p>{cinema.address}</p>
                  </div>

                  <div className="flex gap-3">
                    <Phone size={16} />
                    <p>1900 6017</p>
                  </div>

                  <div className="flex gap-3">
                    <Mail size={16} />
                    <p>support@pvmcinema.vn</p>
                  </div>

                  <div className="flex gap-3">
                    <Clock3 size={16} />
                    <p>08:00 - 23:30</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="mt-5 w-full rounded-full bg-[#ff3b3b] py-3 font-bold transition hover:bg-[#ff5252]"
                >
                  Liên hệ ngay
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-lg font-bold">Thông tin nhanh</h3>

                <div className="space-y-3 text-sm text-white/80">
                  <div className="flex items-center justify-between">
                    <span>Thành phố</span>
                    <span className="font-semibold text-white">{cinema.city}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Số phòng</span>
                    <span className="font-semibold text-white">{cinemaRooms.length} phòng</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Phòng đặc biệt</span>
                    <span className="font-semibold text-white">{specialRoomCount}</span>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </main>

        <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-white/40 md:px-8">
          © 2026 PVM Cinemas. Bảo lưu mọi quyền.
        </footer>
      </div>
    </div>
  );
}