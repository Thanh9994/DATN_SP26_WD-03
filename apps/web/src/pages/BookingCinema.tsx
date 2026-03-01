import { useShowTime } from "@web/hooks/useShowTime";
import { Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { IShowTime } from "@shared/schemas";

export const BookingCinema = () => {
  const { id } = useParams(); // movieId từ URL
  const { showtimes, isLoading } = useShowTime(id);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const { selectedShowtime, setSelectedShowtime } = useOutletContext<any>();

  // 1. Lấy danh sách các ngày có suất chiếu duy nhất
  const uniqueDates = useMemo(() => {
    if (!showtimes || showtimes.length === 0) return [];
    return Array.from(
      new Set(showtimes.map((st) => dayjs(st.startTime).format("YYYY-MM-DD"))),
    ).sort();
  }, [showtimes]);

  // 2. Tự động chọn ngày đầu tiên nếu chưa có ngày nào được chọn
  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  // 3. Lọc và Nhóm suất chiếu theo Rạp (Cinema) dựa trên ngày đã chọn
  const showtimesByCinema = useMemo(() => {
    if (!selectedDate || !showtimes) return {};

    return showtimes
      .filter((st) => dayjs(st.startTime).format("YYYY-MM-DD") === selectedDate)
      .reduce((acc: Record<string, IShowTime[]>, st) => {
        // Lấy tên rạp từ populate: st.roomId.cinema_id.name
        const cinema = (st.roomId as any)?.cinema_id;
        const cinemaName = cinema?.name || "Rạp chưa xác định";

        if (!acc[cinemaName]) acc[cinemaName] = [];
        acc[cinemaName].push(st);
        return acc;
      }, {});
  }, [showtimes, selectedDate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="pb-32 px-4 md:px-0">
      {/* SECTION: CHỌN NGÀY */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#b89d9f]">
            Select Date
          </h3>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
          {uniqueDates.map((date) => {
            const isActive = date === selectedDate;
            const d = dayjs(date);
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center min-w-[100px] py-6 rounded-[2.5rem] shrink-0 transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white scale-105 shadow-[0_10px_30px_rgba(255,0,0,0.3)]"
                    : "bg-white/5 text-[#b89d9f] hover:bg-white/10"
                }`}
              >
                <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">
                  {d.format("MMM")}
                </span>
                <span className="text-4xl font-black my-1">
                  {d.format("DD")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  {d.format("dddd")}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION: CHỌN RẠP VÀ SUẤT CHIẾU */}
      <section className="space-y-8">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#b89d9f]">
          Cinema Locations
        </h3>

        {Object.keys(showtimesByCinema).length === 0 ? (
          <div className="py-12 bg-white/5 rounded-[2rem] flex flex-col items-center">
            <Empty
              description={
                <span className="text-[#b89d9f]">
                  Không có suất chiếu nào cho ngày này
                </span>
              }
            />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(showtimesByCinema).map(([cinemaName, times]) => {
              const cinemaInfo = (times[0].roomId as any)?.cinema_id;

              return (
                <div
                  key={cinemaName}
                  className="bg-[#1a1a1a] rounded-[2.5rem] border border-white/5 overflow-hidden transition-all hover:border-white/10"
                >
                  {/* Thông tin Rạp */}
                  <div className="p-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-3xl">
                        theaters
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-2xl text-white leading-tight">
                        {cinemaName}
                      </h4>
                      <p className="text-sm text-[#b89d9f] flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-sm">
                          location_on
                        </span>
                        {cinemaInfo?.address || "Đang cập nhật địa chỉ..."}
                      </p>
                    </div>
                  </div>

                  {/* Lưới các suất chiếu */}
                  <div className="px-8 pb-8 pt-6 border-t border-white/5 bg-white/[0.02]">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                      {times
                        .sort(
                          (a, b) =>
                            dayjs(a.startTime).unix() -
                            dayjs(b.startTime).unix(),
                        )
                        .map((st: any) => {
                          const isSelected = selectedShowtime?._id === st._id;
                          return (
                            <button
                              key={st._id}
                              onClick={() => setSelectedShowtime(st)}
                              className={`group relative flex flex-col items-center justify-center px-4 py-5 rounded-3xl text-sm font-bold transition-all duration-300 border ${
                                isSelected
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                                  : "bg-white/5 border-white/5 text-white hover:border-white/20 hover:bg-white/10"
                              }`}
                            >
                              <span className="text-lg">
                                {dayjs(st.startTime).format("HH:mm")}
                              </span>
                              <div
                                className={`text-[10px] mt-1 font-medium transition-colors ${
                                  isSelected
                                    ? "text-white/80"
                                    : "text-[#b89d9f]"
                                }`}
                              >
                                {st.roomId?.ten_phong || "Standard"}
                              </div>

                              {/* Hiển thị số ghế trống (Sử dụng dữ liệu từ seatInfo của backend) */}
                              {st.seatInfo && (
                                <div
                                  className={`text-[9px] mt-1 font-normal opacity-60`}
                                >
                                  {st.seatInfo.total - st.seatInfo.booked} ghế
                                  trống
                                </div>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
