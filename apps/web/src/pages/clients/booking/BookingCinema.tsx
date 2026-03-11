import { useShowTimesByMovie } from "@web/hooks/useShowTime";
import { Spin, Empty, message } from "antd";
import dayjs from "dayjs";
import { ChevronDown, Ticket, CalendarDays, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "@web/hooks/useAuth";

export const BookingCinema = () => {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("movieId");
  const navigate = useNavigate();
  const { user } = useAuth();

  const { groupedByCinema, isLoading } = useShowTimesByMovie(movieId!);

  const nextDays = Array.from({ length: 8 }).map((_, i) =>
    dayjs().add(i, "day").format("YYYY-MM-DD"),
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
      .map((item: any) => ({
        ...item,
        showtimesInDate: item.showtimes.filter(
          (st: any) => dayjs(st.startTime).format("YYYY-MM-DD") === activeDate,
        ),
      }))
      .filter((item: any) => item.showtimesInDate.length > 0);
  }, [groupedByCinema, activeDate]);

  if (isLoading)
    return (
      <div className="h-64 flex items-center justify-center">
        <Spin size="large" tip="Đang tải lịch chiếu..." fullscreen />
      </div>
    );

  return (
    <div className="w-full min-h-[80vh] space-y-8 animate-slide-down">
      {/* KHỐI CHỌN NGÀY */}
      <section>
        <div className="flex items-center gap-2 mb-6 px-4 lg:px-0">
          <CalendarDays size={18} className="text-primary top-0" />
          <h3 className="text-sm pt-[9px] font-black uppercase tracking-[0.2em] text-[#b89d9f] flex items-center">
            Select Date
          </h3>
        </div>

        {/* Căn chỉnh lại container scroll */}
        <div className="flex p-2 lg:p-4 gap-4 overflow-x-auto no-scrollbar pb-4">
          {nextDays.map((date) => {
            const isSelected = date === activeDate;
            const isToday = date === dayjs().format("YYYY-MM-DD");

            return (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedShowtime(null);
                  setSelectedSeats([]);
                }}
                // w-[90px] và flex-shrink-0 giúp các nút luôn bằng nhau
                className={`flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-28 flex-shrink-0 rounded-[1.5rem] transition-all border ${
                  isSelected
                    ? "bg-primary border-primary text-white scale-105 shadow-lg shadow-primary/20"
                    : "bg-white/5 border-white/10 text-[#b89d9f] hover:bg-white/10"
                }`}
              >
                <span className="text-[10px] lg:text-[13px] sm:text-[10px] font-bold uppercase mb-1 text-center">
                  {isToday ? "Today" : dayjs(date).format("MMM")}
                </span>
                <span className="text-2xl md:text-4xl uppercase font-black">
                  {dayjs(date).format("DD")}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* KHỐI DANH SÁCH RẠP */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-4 lg:px-0">
          <MapPin size={20} className="text-primary top-0" />
          <h3 className="text-sm pt-[8px] font-black uppercase tracking-[0.2em] text-[#b89d9f]">
            Cinema Locations
          </h3>
        </div>

        {filteredData.length === 0 ? (
          <div className="px-4 lg:px-0">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-[#b89d9f]">
                  Không có suất chiếu cho ngày{" "}
                  {dayjs(activeDate).format("DD/MM")}
                </span>
              }
            />
          </div>
        ) : (
          <div className="space-y-4 pb-3 px-4 lg:px-0 md:pb-5">
            {filteredData.map((item: any) => {
              const cinemaId = item.cinemaInfo?._id;
              const isOpen = openCinemas === cinemaId;

              return (
                <div
                  key={cinemaId}
                  className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-300"
                >
                  <div
                    className="p-4 md:p-6 flex justify-between items-center gap-4 cursor-pointer hover:bg-white/10"
                    onClick={() => toggleCinema(cinemaId)}
                  >
                    <div className="flex items-center px-4 md:px-0 gap-4">
                      <div className="hidden md:block">
                        <div className="translate-y-[-1px] w-12 h-12 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary ">
                          <Ticket size={32} strokeWidth={2.2} />
                        </div>
                      </div>
                      <div className="pt-2">
                        <h4 className="font-black text-base md:text-xl text-white">
                          {item.cinemaInfo?.name}
                        </h4>
                        <p className="text-[10px] md:text-xs text-[#b89d9f] truncate max-w-[180px] sm:max-w-none">
                          {item.cinemaInfo?.address}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-[#b89d9f] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-4 border-t border-white/5 animate-fade-in">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {item.showtimesInDate.map((st: any) => (
                          <button
                            key={st._id}
                            onClick={async () => {
                              if (!user) {
                                message.warning(
                                  "Vui lòng đăng nhập để tiếp tục!",
                                );

                                const redirect = encodeURIComponent(
                                  `/booking/seats?showtimeId=${st._id}&movieId=${movieId}`,
                                );

                                navigate(`/login?redirect=${redirect}`);
                                return;
                              }

                              const pendingShowtimeId =
                                selectedShowtime?._id ||
                                (typeof pendingBooking?.showTimeId === "string"
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
                                    await cancelBooking(pendingBooking._id);
                                  }
                                } catch (error) {
                                  console.error(
                                    "Expire booking failed:",
                                    error,
                                  );
                                }
                              }

                              setSelectedShowtime(st);
                              setSelectedSeats([]);

                              navigate(
                                `/booking/seats?showtimeId=${st._id}&movieId=${movieId}`,
                              );
                            }}
                            className={`py-4 rounded-2xl text-center transition-all border ${
                              selectedShowtime?._id === st._id
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                                : "bg-white/5 border-transparent text-white hover:bg-white/10"
                            }`}
                          >
                            <span className="block text-lg font-black leading-tight">
                              {dayjs(st.startTime).format("HH:mm")}
                            </span>
                            <span className="text-[10px] opacity-60 uppercase">
                              {st.roomId?.ten_phong || "2D"}
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
