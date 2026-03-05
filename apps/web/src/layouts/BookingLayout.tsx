import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useMovie } from "@web/hooks/useMovie";
import { Button, message, Spin } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useBooking } from "@web/hooks/useBooking";
import { IShowTime, IShowTimeSeat } from "@shared/schemas";
import { useAuth } from "@web/hooks/useAuth";

const BookingLayout = () => {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("movieId") || undefined;
  const showtimeIdFromUrl = searchParams.get("showtimeId");
  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Quản lý trạng thái dùng chung
  const [selectedShowtime, setSelectedShowtime] = useState<IShowTime | null>(
    null,
  );
  const [selectedSeats, setSelectedSeats] = useState<IShowTimeSeat[]>([]);

  const { data: movie, isLoading: isMovieLoading } = useMovie(movieId);

  const activeShowtimeId = selectedShowtime?._id || showtimeIdFromUrl;
  const { showTime, holdSeats, isHolding, refreshSeats } = useBooking(
    activeShowtimeId ?? undefined,
  );

  const isSelectSeatStep = location.pathname.includes("/seats");
  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (isMovieLoading)
    return (
      <div className="h-full flex items-center justify-center bg-[#120a0a]">
        <Spin size="large" tip="Đang tải dữ liệu..." fullscreen />
      </div>
    );

  if (!movie)
    return (
      <div className="text-center pt-40 bg-[#120a0a] h-full text-white">
        <p className="text-[#b89d9f] mb-4">Không tìm thấy thông tin phim.</p>
        <Button danger onClick={() => navigate("/")}>
          Quay lại trang chủ
        </Button>
      </div>
    );

  const handleAction = async () => {
    //trang chọn lịch chiếu -> Chuyển sang chọn ghế
    if (!isSelectSeatStep) {
      if (!selectedShowtime) {
        message.warning("Vui lòng chọn một suất chiếu!");
        return;
      }
      navigate(
        `/booking/seats?movieId=${movieId}&showtimeId=${selectedShowtime._id}`,
      );
      return;
    }

    // trang chọn ghế -> Giữ ghế và sang thanh toán
    if (selectedSeats.length === 0) {
      message.warning("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    try {
      if (!user) {
        message.warning("Vui lòng đăng nhập trước khi đặt vé!");
        navigate("/login");
        return;
      }
      await holdSeats({
        showTimeId: activeShowtimeId!,
        seats: selectedSeats.map((s) => s.seatCode),
        userId: user?._id as string,
      });

      await refreshSeats();
      message.success("Giữ ghế thành công!");
      navigate(`/checkout?movieId=${movieId}&showtimeId=${activeShowtimeId}`);
    } catch (error) {
      refreshSeats();
    }
  };

  return (
    <div className="h-full bg-[#120a0a] text-white py-8 lg:py-10 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10">
        {/* ASIDE: THÔNG TIN CHI TIẾT PHIM */}
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 h-fit space-y-8">
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

        <main className="w-full lg:w-3/4 ">
          <Outlet
            context={{
              movie,
              selectedShowtime,
              setSelectedShowtime,
              selectedSeats,
              setSelectedSeats,
            }}
          />
          {(selectedShowtime || showTime) && (
            <div
              className="bg-zinc-900/50 
                p-5 lg:p-10
                rounded-2xl lg:rounded-3xl 
                border border-white/5 
                backdrop-blur-sm 
                space-y-5 lg:space-y-6"
            >
              <div className="flex border-b border-white/5">
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                    Tổng cộng
                  </p>
                  <p className="text-2xl lg:text-3xl font-black text-primary">
                    {totalAmount.toLocaleString()} VND
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 text-sm">
                <div className="space-y-1">
                  <p className="text-zinc-500 uppercase text-sm font-bold tracking-wider">
                    Rạp / Phòng
                  </p>
                  <p className="font-bold text-zinc-200">
                    {showTime?.roomId?.cinema_id?.name || "Cinema"} -{" "}
                    {showTime?.roomId?.ten_phong || "Standard"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-500 uppercase text-sm font-bold tracking-wider">
                    Suất chiếu
                  </p>
                  <p className="font-bold text-zinc-200">
                    {showTime?.startTime
                      ? dayjs(showTime.startTime).format("HH:mm - DD/MM/YYYY")
                      : "Chưa chọn"}
                  </p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-zinc-500 uppercase text-sm font-bold tracking-wider">
                    Ghế đã chọn
                  </p>
                  <p className="font-black text-primary text-lg">
                    {selectedSeats.length > 0
                      ? selectedSeats.map((s) => s.seatCode).join(", ")
                      : "Vui lòng chọn ghế"}
                  </p>
                </div>
              </div>

              <Button
                type="primary"
                danger
                size="middle"
                block
                loading={isHolding}
                onClick={handleAction}
                className="h-12 lg:h-14
                  font-bold lg:font-black
                  uppercase
                  tracking-wide lg:tracking-widest
                  text-base lg:text-lg
                  rounded-xl lg:rounded-2xl"
              >
                {isSelectSeatStep
                  ? "Xác nhận & Thanh toán"
                  : "Tiếp tục chọn ghế"}
              </Button>

              <p className="text-center text-[10px] text-zinc-600 italic">
                * Bằng việc nhấn tiếp tục, bạn đồng ý với điều khoản đặt vé của
                chúng tôi.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default BookingLayout;
