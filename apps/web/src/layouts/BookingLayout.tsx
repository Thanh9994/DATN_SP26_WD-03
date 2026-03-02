import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useMovie } from "@web/hooks/useMovie";
import { Spin } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

export default function BookingLayout() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("movieId") || undefined;
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu phim từ hook
  const { data: movie, isLoading } = useMovie(id);

  // Quản lý trạng thái dùng chung thông qua Outlet Context
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

  const isSelectSeatStep = location.pathname.includes("/seats");
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#120a0a]">
        <Spin size="large" />
      </div>
    );

  if (!movie)
    return (
      <div className="text-center pt-40 bg-[#120a0a] min-h-screen text-white">
        <p className="text-[#b89d9f] mb-4">
          Không tìm thấy thông tin phim hoặc ID không hợp lệ.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary rounded-full font-bold transition-transform hover:scale-105"
        >
          Quay lại trang chủ
        </button>
      </div>
    );

  const handleNextStep = () => {
    if (!isSelectSeatStep && selectedShowtime) {
      // Điều hướng sang bước chọn ghế, giữ movieId và thêm showtimeId
      navigate(
        `/booking/${id}/seats?movieId=${id}&showtimeId=${selectedShowtime._id}`,
      );
    } else if (isSelectSeatStep && selectedSeats.length > 0) {
      // Bước này sẽ gọi mutation confirmBooking từ hook useBooking
      console.log("Tiến hành thanh toán cho các ghế:", selectedSeats);
    }
  };

  return (
    <div className="bg-[#120a0a] mt-5 min-h-screen text-white">
      <div className="max-w-7xl mx-auto  px-8 pb-40 flex flex-col lg:flex-row gap-12">
        {/* ASIDE: THÔNG TIN CHI TIẾT PHIM */}
        <aside className="w-full lg:w-1/3 lg:sticky lg:top-24 h-fit space-y-8">
          <div className="relative aspect-[2/3] w-full rounded-[2.5rem] overflow-hidden shadow-2xl group">
            <img
              src={movie.poster.url}
              alt={movie.ten_phim}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120a0a] via-transparent to-transparent opacity-60"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight uppercase">
            {movie.ten_phim}
          </h1>
          <div className="space-y-4">
            <div className="flex items-center gap-5">
              <span className="px-2 py-1 bg-primary/20 text-primary text-[12px] font-black uppercase tracking-widest rounded-md border border-primary/30">
                {movie.ngay_cong_chieu
                  ? dayjs(movie.ngay_cong_chieu).format("YYYY")
                  : "2024"}
              </span>
              <span className="text-[#b89d9f] text-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  schedule
                </span>
                {movie.thoi_luong} phút
                <span className="mx-2 px-2 py-1 bg-primary/20 text-primary text-[12px] font-black uppercase tracking-widest rounded-md border border-primary/30">
                  {movie.do_tuoi}
                </span>
              </span>
            </div>
          </div>
        </aside>

        <main className="w-full lg:w-2/3">
          <Outlet
            context={{
              movie,
              selectedShowtime,
              setSelectedShowtime,
              selectedSeats,
              setSelectedSeats,
            }}
          />
        </main>
      </div>

      {/* FIXED FOOTER: THANH TRẠNG THÁI ĐẶT VÉ */}
      <footer className="fixed bottom-0 left-0 right-0 z-[110] bg-[#120a0a]/90 backdrop-blur-xl border-t border-white/10 py-6 px-4 md:px-12 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8 md:gap-12 w-full md:w-auto overflow-x-auto">
            {/* Display: Suất chiếu hoặc Ghế */}
            <div className="flex flex-col min-w-fit">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b89d9f] mb-1">
                {isSelectSeatStep ? "Ghế đã chọn" : "Suất chiếu đang chọn"}
              </span>
              <p className="text-xl font-black text-white whitespace-nowrap">
                {isSelectSeatStep
                  ? selectedSeats.map((s) => s.seatCode).join(", ") ||
                    "Chưa chọn ghế"
                  : selectedShowtime
                    ? `${dayjs(selectedShowtime.startTime).format("HH:mm")} • ${selectedShowtime.roomId?.ten_phong || "Standard"}`
                    : "Chọn một suất chiếu"}
              </p>
            </div>

            {/* Display: Tổng tiền (Chỉ hiện khi ở bước chọn ghế) */}
            {isSelectSeatStep && (
              <>
                <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                <div className="flex flex-col min-w-fit">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b89d9f] mb-1">
                    Tổng tạm tính
                  </span>
                  <p className="text-2xl font-black text-primary italic">
                    {total.toLocaleString()}đ
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-4 w-full md:max-w-xs">
            <button
              onClick={handleNextStep}
              disabled={
                (!isSelectSeatStep && !selectedShowtime) ||
                (isSelectSeatStep && selectedSeats.length === 0)
              }
              className="flex-1 h-16 bg-primary disabled:bg-white/5 text-white disabled:text-white/20 rounded-2xl flex items-center justify-center gap-3 font-black text-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <span>
                {isSelectSeatStep ? "Xác nhận đặt chỗ" : "Chọn chỗ ngồi"}
              </span>
              <span className="material-symbols-outlined font-black">
                {isSelectSeatStep ? "payments" : "chair_alt"}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
