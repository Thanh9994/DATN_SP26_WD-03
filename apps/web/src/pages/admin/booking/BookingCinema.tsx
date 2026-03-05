import { useShowTimesByMovie } from "@web/hooks/useShowTime";
import { Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

export const BookingCinema = () => {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("movieId");

  // Lấy dữ liệu từ hook. GroupedByCinema lúc này sẽ chứa cinemaInfo và mảng showtimes
  const { showtimes, groupedByCinema, isLoading } = useShowTimesByMovie(
    movieId!,
  );

  const [selectedDate, setSelectedDate] = useState<string>("");
  const { setSelectedShowtime, selectedShowtime } = useOutletContext<any>();

  // 1. Lấy danh sách các ngày có lịch chiếu (Unique Dates)
  // Dùng Optional Chaining và Nullish Coalescing để tránh lỗi map trên undefined
  const uniqueDates = Array.from(
    new Set(
      (showtimes ?? []).map((st: any) =>
        dayjs(st.startTime).format("YYYY-MM-DD"),
      ),
    ),
  ).sort() as string[];

  // Xác định ngày đang chọn (Mặc định là ngày đầu tiên nếu user chưa click)
  const activeDate =
    selectedDate || (uniqueDates.length > 0 ? uniqueDates[0] : "");

  // 2. Lọc dữ liệu hiển thị theo ngày
  const filteredData = (groupedByCinema ?? [])
    .map((item: any) => ({
      ...item,
      // Lọc lại danh sách suất chiếu của rạp này, chỉ giữ lại các suất chiếu trong ngày activeDate
      showtimesInDate: item.showtimes.filter(
        (st: any) => dayjs(st.startTime).format("YYYY-MM-DD") === activeDate,
      ),
    }))
    // Chỉ hiển thị những rạp nào CÓ suất chiếu trong ngày đó
    .filter((item: any) => item.showtimesInDate.length > 0);

  if (isLoading)
    return (
      <div className="h-64 flex items-center justify-center">
        <Spin size="large" tip="Đang tải lịch chiếu..." fullscreen />
      </div>
    );

  return (
    <div className="w-full space-y-8 animate-slide-down">
      {/* KHỐI CHỌN NGÀY */}
      <section className="">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#b89d9f] mb-6">
          Select Date
        </h3>
        <div className="flex mx-3 gap-4 overflow-x-auto no-scrollbar pb-4">
          {uniqueDates.length > 0 ? (
            uniqueDates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center min-w-[90px] m-3 p-5 rounded-[2rem] transition-all ${
                  date === activeDate
                    ? "bg-primary text-white scale-105 shadow-lg"
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
            ))
          ) : (
            <div className="text-[#b89d9f] italic">
              Hiện tại chưa có lịch chiếu cho phim này.
            </div>
          )}
        </div>
      </section>

      {/* KHỐI DANH SÁCH RẠP */}
      <section className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#b89d9f]">
          Cinema Locations
        </h3>

        {filteredData.length === 0 ? (
          <Empty
            description={
              <span className="text-[#b89d9f]">
                Không tìm thấy suất chiếu nào cho ngày này
              </span>
            }
          />
        ) : (
          filteredData.map((item: any) => (
            <div
              key={item.cinemaInfo?._id}
              className="bg-[#1a1a1a] rounded-[2rem] border border-white/5 overflow-hidden"
            >
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">
                    theater_comedy
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-xl text-white">
                    {item.cinemaInfo?.name}
                  </h4>
                  <p className="text-xs text-[#b89d9f]">
                    {item.cinemaInfo?.address}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-white/5">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {item.showtimesInDate.map((st: any) => (
                    <button
                      key={st._id}
                      onClick={() => setSelectedShowtime(st)}
                      className={`py-4 rounded-2xl text-center transition-all border ${
                        selectedShowtime?._id === st._id
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                          : "bg-white/5 border-transparent text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="block text-lg font-black">
                        {dayjs(st.startTime).format("HH:mm")}
                      </span>
                      <span className="text-[10px] opacity-60 uppercase">
                        {st.roomId?.ten_phong || "2D"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
