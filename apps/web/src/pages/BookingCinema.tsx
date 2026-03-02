import { useShowTime } from "@web/hooks/useShowTime";
import { useCinemas } from "@web/hooks/useCinema"; // Giả sử bạn có hook này
import { Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { IShowTime } from "@shared/schemas";

export const BookingCinema = () => {
  const { id } = useParams();
  const { showtimes, isLoading: loadingST } = useShowTime(id);
  const { cinemas, isLoading: loadingCinema } = useCinemas(); // Lấy all rạp

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("all"); // Mặc định là tất cả

  const { selectedShowtime, setSelectedShowtime } = useOutletContext<any>();

  // 1. Lấy danh sách các ngày duy nhất
  const uniqueDates = useMemo(() => {
    if (!showtimes) return [];
    return Array.from(
      new Set(showtimes.map((st) => dayjs(st.startTime).format("YYYY-MM-DD"))),
    ).sort();
  }, [showtimes]);

  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate)
      setSelectedDate(uniqueDates[0]);
  }, [uniqueDates, selectedDate]);

  // 2. Lọc suất chiếu theo Ngày VÀ Rạp
  const showtimesByCinema = useMemo(() => {
    if (!selectedDate || !showtimes) return {};

    return showtimes
      .filter((st) => {
        const matchDate =
          dayjs(st.startTime).format("YYYY-MM-DD") === selectedDate;
        const cinemaId = (st.roomId as any)?.cinema_id?._id;
        const matchCinema =
          selectedCinemaId === "all" || cinemaId === selectedCinemaId;
        return matchDate && matchCinema;
      })
      .reduce((acc: Record<string, IShowTime[]>, st) => {
        const cinemaName =
          (st.roomId as any)?.cinema_id?.name || "Rạp chưa xác định";
        if (!acc[cinemaName]) acc[cinemaName] = [];
        acc[cinemaName].push(st);
        return acc;
      }, {});
  }, [showtimes, selectedDate, selectedCinemaId]);

  if (loadingST || loadingCinema)
    return (
      <div className="h-64 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="pb-32 px-4 md:px-0 animate-slide-down">
      {/* SECTION: CHỌN NGÀY (Giữ nguyên của bạn) */}
      <section className="mb-10">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#b89d9f] mb-6">
          Select Date
        </h3>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {uniqueDates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center min-w-[90px] py-5 rounded-[2rem] transition-all ${
                date === selectedDate
                  ? "bg-primary text-white scale-105 shadow-lg shadow-primary/30"
                  : "bg-white/5 text-[#b89d9f]"
              }`}
            >
              <span className="text-[10px] font-bold uppercase">
                {dayjs(date).format("MMM")}
              </span>
              <span className="text-3xl font-black">
                {dayjs(date).format("DD")}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION: CHỌN RẠP (Mới thêm) */}
      <section className="mb-10">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#b89d9f] mb-6">
          Cinemas
        </h3>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setSelectedCinemaId("all")}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all shrink-0 border ${
              selectedCinemaId === "all"
                ? "bg-white text-black border-white"
                : "bg-transparent border-white/10 text-white"
            }`}
          >
            Tất cả rạp
          </button>
          {cinemas?.map((cinema: any) => (
            <button
              key={cinema._id}
              onClick={() => setSelectedCinemaId(cinema._id)}
              className={`px-6 py-3 rounded-full text-xs font-bold transition-all shrink-0 border ${
                selectedCinemaId === cinema._id
                  ? "bg-white text-black border-white"
                  : "bg-transparent border-white/10 text-white"
              }`}
            >
              {cinema.name}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION: DANH SÁCH SUẤT CHIẾU (Đã lọc) */}
      <section className="space-y-6">
        {Object.keys(showtimesByCinema).length === 0 ? (
          <Empty
            description={
              <span className="text-[#b89d9f]">
                Không có suất chiếu phù hợp
              </span>
            }
            className="py-10"
          />
        ) : (
          Object.entries(showtimesByCinema).map(([cinemaName, times]) => (
            <div
              key={cinemaName}
              className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 overflow-hidden"
            >
              <div className="p-6 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-2xl">
                  theaters
                </span>
                <div>
                  <h4 className="font-black text-xl text-white">
                    {cinemaName}
                  </h4>
                  <p className="text-xs text-[#b89d9f]">
                    {(times[0].roomId as any)?.cinema_id?.address}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-white/5 grid grid-cols-3 sm:grid-cols-5 gap-3">
                {times
                  .sort(
                    (a, b) =>
                      dayjs(a.startTime).unix() - dayjs(b.startTime).unix(),
                  )
                  .map((st: any) => (
                    <button
                      key={st._id}
                      onClick={() => setSelectedShowtime(st)}
                      className={`py-4 rounded-2xl text-center transition-all border ${
                        selectedShowtime?._id === st._id
                          ? "bg-primary border-primary text-white"
                          : "bg-white/5 border-transparent text-white"
                      }`}
                    >
                      <span className="block text-base font-black">
                        {dayjs(st.startTime).format("HH:mm")}
                      </span>
                      <span className="text-[10px] opacity-60 uppercase">
                        {st.roomId?.loai_phong || "2D"}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
