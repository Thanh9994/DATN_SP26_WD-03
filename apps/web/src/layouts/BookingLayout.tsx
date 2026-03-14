import { Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useMovie } from '@web/hooks/useMovie';
import { Button, message, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useBooking } from '@web/hooks/useBooking';
import { IShowTime, IShowTimeSeat } from '@shared/schemas';
import { useAuth } from '@web/hooks/useAuth';
import { ArrowLeft, MapPin } from 'lucide-react';

const BookingLayout = () => {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get('movieId') || undefined;
  const showtimeIdFromUrl = searchParams.get('showtimeId');
  const { user } = useAuth();
  const location = useLocation();

  const navigate = useNavigate();
  const prevPathRef = useRef(location.pathname);

  // Quản lý trạng thái dùng chung
  const [selectedShowtime, setSelectedShowtime] = useState<IShowTime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<IShowTimeSeat[]>([]);

  const activeShowtimeId = selectedShowtime?._id ?? showtimeIdFromUrl ?? undefined;

  const {
    showTime,
    holdSeats,
    isHolding,
    refreshSeats,
    pendingBooking,
    cancelBooking,
    expireBooking,
  } = useBooking(activeShowtimeId);

  useEffect(() => {
    if (!pendingBooking || !showTime?.seats) return;

    const seatCodes = pendingBooking.seatCodes;
    if (!seatCodes || seatCodes.length === 0) return;

    const seatsFromShowtime =
      showTime?.seats?.filter((s: any) => seatCodes.includes(s.seatCode)) || [];

    if (seatsFromShowtime.length !== selectedSeats.length) {
      setSelectedSeats(seatsFromShowtime);
    }
  }, [pendingBooking, showTime?.seats]);

  const { data: movie, isLoading: isMovieLoading } = useMovie(movieId);

  useEffect(() => {
    const savedSeatsJSON = localStorage.getItem('temp_seats');

    if (!user || !activeShowtimeId || !savedSeatsJSON) return;

    localStorage.removeItem('temp_seats');

    try {
      const seatsToHold: IShowTimeSeat[] = JSON.parse(savedSeatsJSON);

      if (!seatsToHold || seatsToHold.length === 0) return;

      holdSeats({
        showTimeId: activeShowtimeId,
        seats: seatsToHold.map((s) => s.seatCode),
      })
        .then((result) => {
          setTimeout(() => {
            navigate('/payments', {
              state: {
                bookingId: result.bookingId,
                holdToken: result.holdToken,
                totalAmount: result.totalAmount,
                seats: seatsToHold.map((s) => s.seatCode),
                movieInfo: {
                  title: movie?.ten_phim,
                  poster: movie?.poster?.url,
                  showtime: showTime?.startTime
                    ? dayjs(showTime.startTime).format('HH:mm - DD/MM/YYYY')
                    : 'Showtime',
                },
              },
            });
          }, 400);
        })
        .catch((err) => {
          console.error('Auto hold failed:', err);
          message.error(err?.message || 'Không thể tự động giữ ghế. Vui lòng chọn lại ghế.');
        });
    } catch (error) {
      console.error('Parse seats error:', error);
    }
  }, [user?._id, activeShowtimeId, movie, showTime]);

  const currentData = showTime ?? selectedShowtime ?? null;

  const cinema = currentData?.roomId?.cinema_id ?? (currentData as any)?.cinemaInfo ?? null;

  const isSelectSeatStep = location.pathname.includes('/seats');
  const totalAmount =
    selectedSeats.length > 0
      ? selectedSeats.reduce((sum, s) => sum + s.price, 0)
      : pendingBooking?.totalAmount || 0;

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const isLeavingSeats =
      prevPath.includes('/booking/seats') && !location.pathname.includes('/booking/seats');
    const isBackToBooking = location.pathname.startsWith('/booking');

    if (isLeavingSeats && isBackToBooking && pendingBooking?._id && pendingBooking?.holdToken) {
      expireBooking({
        bookingId: pendingBooking._id,
        holdToken: pendingBooking.holdToken,
      }).catch((error) => {
        console.error('Expire booking quay lại thất bại:', error);
      });
      setSelectedSeats([]);
      setSelectedShowtime(null);
    }

    prevPathRef.current = location.pathname;
  }, [location.pathname, pendingBooking?._id, pendingBooking?.holdToken, expireBooking]);

  const handleBackToCinema = async () => {
    if (pendingBooking?._id && pendingBooking?.holdToken) {
      try {
        await expireBooking({ bookingId: pendingBooking._id, holdToken: pendingBooking.holdToken });
      } catch (error) {
        console.error('Expire booking failed:', error);
      }
    }

    setSelectedSeats([]);
    setSelectedShowtime(null);
    navigate(`/booking?movieId=${movieId}`);
  };
  // console.log('user', user);
  // console.log('selectedShowtime', selectedShowtime);
  // console.log('showtimeIdFromUrl', showtimeIdFromUrl);
  // console.log('activeShowtimeId', activeShowtimeId);

  if (isMovieLoading)
    return (
      <div className="flex h-full items-center justify-center bg-[#120a0a]">
        <Spin size="large" tip="Đang tải dữ liệu..." fullscreen />
      </div>
    );

  if (!movie)
    return (
      <div className="h-full bg-[#120a0a] pt-40 text-center text-white">
        <p className="mb-4 text-[#b89d9f]">Không tìm thấy thông tin phim.</p>
        <Button danger onClick={() => navigate('/')}>
          Quay lại trang chủ
        </Button>
      </div>
    );

  const handleAction = async () => {
    // step 1: chọn lịch -> sang chọn ghế
    if (!isSelectSeatStep) {
      if (!selectedShowtime) {
        message.warning('Vui lòng chọn một suất chiếu!');
        return;
      }

      navigate(`/booking/seats?movieId=${movieId}&showtimeId=${selectedShowtime._id}`);
      return;
    }

    const targetShowtimeId = showtimeIdFromUrl || selectedShowtime?._id;

    if (!targetShowtimeId) {
      message.error('Không tìm thấy mã suất chiếu!');
      return;
    }

    try {
      if (!activeShowtimeId) {
        message.error('Không tìm thấy suất chiếu');
        return;
      }

      const result = await holdSeats({
        showTimeId: activeShowtimeId,
        seats: selectedSeats.map((s) => s.seatCode),
      });

      await refreshSeats();

      message.success('Giữ ghế thành công!');

      navigate('/payments', {
        state: {
          bookingId: result.bookingId,
          holdToken: result.holdToken,
          totalAmount: result.totalAmount,
          seats: selectedSeats.map((s) => s.seatCode),
          movieInfo: {
            title: movie.ten_phim,
            poster: movie.poster?.url,
            showtime: currentData?.startTime
              ? dayjs(currentData.startTime).format('HH:mm - DD/MM/YYYY')
              : 'Showtime',
          },
        },
      });
    } catch (error) {
      refreshSeats();
    }
  };

  return (
    <div className="h-full bg-[#120a0a] py-8 pb-20 text-white lg:py-10 lg:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row">
        {/* ASIDE: THÔNG TIN CHI TIẾT PHIM */}
        <aside className="h-fit w-full space-y-8 lg:sticky lg:top-24 lg:w-1/4">
          <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
            <img
              src={movie.poster.url}
              alt={movie.ten_phim}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120a0a] via-transparent to-transparent opacity-60"></div>
          </div>
          <h1 className="text-2xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
            {movie.ten_phim}
          </h1>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="rounded-md border border-primary/30 bg-primary/20 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                {movie.ngay_cong_chieu ? dayjs(movie.ngay_cong_chieu).format('YYYY') : '2024'}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-[#b89d9f]">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {movie.thoi_luong} Min
                <span className="mx-1 rounded-md border border-primary/30 bg-primary/20 px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary">
                  {movie.do_tuoi}
                </span>
                <span className="mx-1 rounded-md border border-primary/30 bg-primary/20 px-2 py-1 tracking-widest text-white/70">
                  {movie.phu_de}
                </span>
              </span>
            </div>
            {cinema && (
              <div className="border-t border-white/10 pt-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase text-primary">
                      Rạp đã chọn
                    </span>
                  </div>
                  <h4 className="text-sm font-bold uppercase text-zinc-100">{cinema.name}</h4>
                  <p className="mt-1 text-[11px] text-[#b89d9f]">{cinema.address}</p>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="w-full lg:w-3/4">
          <Outlet
            context={{
              movie,
              selectedShowtime,
              setSelectedShowtime,
              selectedSeats,
              setSelectedSeats,
              pendingBooking,
              cancelBooking,
              expireBooking,
            }}
          />
          {activeShowtimeId && showTime && (
            <div className="space-y-4 rounded-2xl border border-white/5 bg-zinc-900/50 p-5 backdrop-blur-sm lg:space-y-5 lg:rounded-3xl lg:p-12">
              <div className="flex border-b border-white/5">
                <div className="text-left">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Tổng cộng
                  </p>
                  <p className="text-2xl font-black text-primary lg:text-3xl">
                    {totalAmount.toLocaleString()} VND
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 text-sm">
                {/* <div className="space-y-1">
                  <p className="text-zinc-500 uppercase text-sm font-bold tracking-wider">
                    Phòng
                  </p>
                  <p className="font-bold text-zinc-200">
                    {showTime?.roomId?.ten_phong || "Standard"}
                  </p>
                </div> */}
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Suất chiếu
                  </p>
                  <p className="text-sm font-medium text-zinc-200">
                    {showTime?.startTime
                      ? dayjs(showTime.startTime).format('HH:mm - DD/MM/YYYY')
                      : 'Chưa chọn'}
                  </p>
                </div>
                {/* <div className="col-span-2 space-y-1"> */}
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Ghế đã chọn
                  </p>
                  <p className="text-lg font-black tracking-widest text-primary">
                    {selectedSeats.length > 0
                      ? selectedSeats.map((s) => s.seatCode).join(', ')
                      : 'Vui lòng chọn ghế'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                {isSelectSeatStep && (
                  <Button
                    type="default"
                    onClick={handleBackToCinema}
                    className="rounded-xl lg:h-14 lg:rounded-2xl lg:text-lg lg:font-black lg:tracking-widest"
                  >
                    <ArrowLeft size={28} strokeWidth={2.5} />
                  </Button>
                )}
                <Button
                  type="primary"
                  danger
                  size="middle"
                  block
                  loading={isHolding}
                  onClick={handleAction}
                  className="h-10 rounded-xl text-base font-bold uppercase tracking-wide lg:h-14 lg:rounded-2xl lg:text-lg lg:font-black lg:tracking-widest"
                >
                  {isSelectSeatStep ? 'Xác nhận & Thanh toán' : 'Tiếp tục chọn ghế'}
                </Button>
              </div>

              <p className="text-center text-[10px] italic text-zinc-600">
                * Bằng việc nhấn tiếp tục, bạn đồng ý với điều khoản đặt vé của chúng tôi.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default BookingLayout;
