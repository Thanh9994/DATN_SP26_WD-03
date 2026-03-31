import { useShowTimesByMovie } from '@web/hooks/useShowTime';
import { Spin, Empty, message } from 'antd';
import dayjs from 'dayjs';
import { ChevronDown, Ticket, CalendarDays, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { useAuth } from '@web/hooks/useAuth';

export const BookingCinema = () => {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get('movieId');
  const navigate = useNavigate();
  const { user } = useAuth();

  const { groupedByCinema, isLoading } = useShowTimesByMovie(movieId!);

  const nextDays = Array.from({ length: 8 }).map((_, i) =>
    dayjs().add(i, 'day').format('YYYY-MM-DD'),
  );

  const [selectedDate, setSelectedDate] = useState<string>(nextDays[0]);
  const [openCinemas, setOpenCinemas] = useState<string | null>(null);

  const {
    setSelectedShowtime,
    selectedShowtime,
    setSelectedSeats,
    pendingBooking,
    cancelBooking,
    expireBooking,
  } = useOutletContext<any>();

  const activeDate = selectedDate;

  const toggleCinema = (cinemaId: string) => {
    setOpenCinemas((prev) => (prev === cinemaId ? null : cinemaId));
  };

  useEffect(() => {
    if (!selectedShowtime) return;

    const cinemaId = selectedShowtime?.roomId?.cinema_id;

    if (cinemaId) {
      setOpenCinemas(cinemaId);
    }
  }, [selectedShowtime]);

  const filteredData = useMemo(() => {
    return (groupedByCinema ?? [])
      .map((item: any) => {
        const showtimesInDate = item.showtimes.filter(
          (st: any) => dayjs(st.startTime).format('YYYY-MM-DD') === selectedDate,
        );
        const sortedShowtimes = showtimesInDate.sort((a: any, b: any) => {
          return dayjs(a.startTime).unix() - dayjs(b.startTime).unix();
        });
        return {
          ...item,
          showtimesInDate: sortedShowtimes,
        };
      })
      .filter((item: any) => item.showtimesInDate.length);
  }, [groupedByCinema, selectedDate]);

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" tip="Đang tải lịch chiếu..." fullscreen />
      </div>
    );

  return (
    <div className="animate-slide-down min-h-[50vh] w-full space-y-3 md:space-y-6">
      {/* KHỐI CHỌN NGÀY */}
      <section className="space-y-3 md:space-y-6">
        <div className="mb-6 flex items-center gap-2 px-2 lg:px-0">
          <CalendarDays size={18} className="top-0 text-primary" />
          <h3 className="flex items-center pt-[8px] text-sm font-black uppercase tracking-[0.2em] text-[#b89d9f]">
            Chọn Ngày
          </h3>
        </div>

        {/* Căn chỉnh lại container scroll */}
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto p-1 pb-4 md:gap-4 lg:p-4">
          {nextDays.map((date) => {
            const isSelected = date === activeDate;
            const isToday = date === dayjs().format('YYYY-MM-DD');

            return (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedShowtime(null);
                  setSelectedSeats([]);
                }}
                // w-[90px] và flex-shrink-0 giúp các nút luôn bằng nhau
                className={`flex h-16 w-16 flex-shrink-0 snap-center flex-col items-center justify-center rounded-2xl border transition-all duration-300 md:h-28 md:w-24 ${
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary/20'
                    : 'border-white/10 bg-white/5 text-[#b89d9f] hover:bg-white/10'
                }`}
              >
                <span
                  className={`text-center text-[9px] font-bold uppercase tracking-tighter md:text-[13px] ${
                    isSelected ? 'text-white/80' : 'text-[#b89d9f]'
                  }`}
                >
                  {isToday ? 'Today' : dayjs(date).format('MMM')}
                </span>
                <span className="mt-1 text-xl font-bold leading-none md:text-3xl md:font-black">
                  {dayjs(date).format('DD')}
                </span>
                {isSelected && <div className="mt-1 h-1 w-1 rounded-full bg-white md:hidden" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* KHỐI DANH SÁCH RẠP */}
      <section className="space-y-3 md:space-y-6">
        <div className="flex items-center gap-2 px-1 lg:px-0">
          <MapPin size={18} className="text-primary md:h-5 md:w-5" />
          <h3 className="pt-[8px] text-sm font-black uppercase tracking-[0.2em] text-[#b89d9f]">
            Địa Chỉ Rạp
          </h3>
        </div>

        {filteredData.length === 0 ? (
          <div className="py-10">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-xs text-[#b89d9f]">
                  Không có suất chiếu cho ngày {dayjs(activeDate).format('DD/MM')}
                </span>
              }
            />
          </div>
        ) : (
          <div className="space-y-3 md:px-3 md:pb-3 lg:px-0">
            {filteredData.map((item: any) => {
              const cinemaId = item.cinemaInfo?._id;
              const isOpen = openCinemas === cinemaId;

              return (
                <div
                  key={cinemaId}
                  className={`overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#1a1a1a] transition-all duration-300 ${
                    isOpen ? 'shadow-2xl ring-1 ring-white/10' : ''
                  }`}
                >
                  <div
                    className="flex cursor-pointer items-center justify-between gap-3 p-3 hover:bg-white/5 md:p-6"
                    onClick={() => toggleCinema(cinemaId)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary md:h-14 md:w-14">
                        <Ticket size={20} className="md:h-7 md:w-7" strokeWidth={2} />
                      </div>
                      <div className="justify-center pt-2 min-w-0 flex flex-col">
                        <h4 className="truncate text-sm font-bold text-white md:text-lg">
                          {item.cinemaInfo?.name}
                        </h4>
                        <p className="max-w-[150px] truncate text-[10px] text-[#b89d9f] sm:max-w-none md:text-xs">
                          {item.cinemaInfo?.address}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#b89d9f] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>

                  {isOpen && (
                    <div className="animate-in fade-in slide-in-from-top-2 border-t border-white/5 bg-black/20 px-3 py-4 md:px-7 md:py-6">
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 md:gap-4 lg:grid-cols-8">
                        {item.showtimesInDate.map((st: any) => (
                          <button
                            key={st._id}
                            onClick={async () => {
                              if (!user) {
                                message.warning('Vui lòng đăng nhập để tiếp tục!');

                                const redirect = encodeURIComponent(
                                  `/booking/seats?showtimeId=${st._id}&movieId=${movieId}`,
                                );

                                navigate(`/login?redirect=${redirect}`);
                                return;
                              }

                              const pendingShowtimeId =
                                selectedShowtime?._id ||
                                (typeof pendingBooking?.showTimeId === 'string'
                                  ? pendingBooking?.showTimeId
                                  : pendingBooking?.showTimeId?._id);

                              if (
                                pendingBooking?._id &&
                                pendingShowtimeId &&
                                pendingShowtimeId !== st._id
                              ) {
                                try {
                                  if (expireBooking) {
                                    await expireBooking(pendingBooking._id);
                                  } else {
                                    await cancelBooking({
                                      bookingId: pendingBooking._id,
                                      holdToken: pendingBooking.holdToken,
                                    });
                                  }
                                } catch (error) {
                                  console.error('Expire booking failed:', error);
                                }
                              }

                              setSelectedShowtime(st);
                              setSelectedSeats([]);

                              navigate(`/booking/seats?showtimeId=${st._id}&movieId=${movieId}`);
                            }}
                            className={`flex flex-col items-center justify-center rounded-xl border py-2 transition-all active:scale-95 ${
                              selectedShowtime?._id === st._id
                                ? 'border-primary bg-primary text-white shadow-lg shadow-primary/40'
                                : 'border-white/10 bg-white/5 text-white hover:border-white/20'
                            }`}
                          >
                            <span className="text-xs font-bold md:text-base">
                              {dayjs(st.startTime).format('HH:mm')}
                            </span>
                            <span
                              className={`text-[7px] uppercase opacity-60 md:text-[10px] ${selectedShowtime?._id === st._id ? 'text-white' : 'text-[#b89d9f]'}`}
                            >
                              {st.roomId?.ten_phong || '2D'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
