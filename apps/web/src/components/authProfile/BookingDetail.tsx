import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import QRCode from 'react-qr-code';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Popcorn,
  QrCode,
  Ticket,
  Armchair,
  Building2,
} from 'lucide-react';
import { Button, Empty, Skeleton, Tag } from 'antd';
import { useMyBookings } from '@web/hooks/useBooking';
import { mapToTicketCl } from '@shared/src/schemas/ticket';

const formatCurrency = (value?: number) => {
  if (!value) return '0 đ';
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
};

const BookingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: rawBookings = [], isLoading } = useMyBookings('paid');

  const booking = useMemo(() => {
    return rawBookings.find((item: any) => item._id === id);
  }, [rawBookings, id]);

  const mappedTicket = useMemo(() => {
    return booking ? mapToTicketCl(booking) : null;
  }, [booking]);

  const movieName =
    booking?.movieName ||
    booking?.showTimeId?.movieId?.ten_phim ||
    booking?.showTimeId?.movie?.ten_phim ||
    mappedTicket?.title ||
    'Đang cập nhật';

  const cinemaName =
    booking?.theaterName ||
    booking?.showTimeId?.roomId?.cinemaId?.name ||
    booking?.showTimeId?.cinemaId?.name ||
    mappedTicket?.cinemaName ||
    'Đang cập nhật';

  const roomName =
    booking?.roomName ||
    booking?.showTimeId?.roomId?.name ||
    mappedTicket?.roomName ||
    'Đang cập nhật';

  const showDate =
    mappedTicket?.date ||
    (booking?.showTimeId?.ngay_chieu
      ? dayjs(booking.showTimeId.ngay_chieu).format('DD/MM/YYYY')
      : 'Đang cập nhật');

  const showTime =
    mappedTicket?.time ||
    booking?.showTimeString ||
    (booking?.showTimeId?.gio_bat_dau ? booking.showTimeId.gio_bat_dau : 'Đang cập nhật');

  const seatCodes =
    booking?.seatCodes?.length > 0
      ? booking.seatCodes.join(', ')
      : mappedTicket?.seatCodes || 'Đang cập nhật';

  const ticketCode = booking?.ticketCode || mappedTicket?.ticketCode || 'N/A';
  const totalAmount = booking?.finalAmount || booking?.totalAmount || 0;
  const paymentMethod = booking?.paymentMethod || 'Đang cập nhật';
  const bookingStatus = booking?.status || 'Đang cập nhật';
  const bookingCreatedAt = booking?.createdAt
    ? dayjs(booking.createdAt).format('HH:mm - DD/MM/YYYY')
    : 'Đang cập nhật';

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <div className="rounded-3xl border border-red-900/40 bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 p-6">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (!booking || !mappedTicket) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
        <div className="rounded-3xl border border-red-900/40 bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 p-10">
          <Empty
            description={<span className="text-gray-400">Không tìm thấy vé</span>}
            imageStyle={{ height: 72 }}
          />
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => navigate('/profile/tickets')}
              className="!rounded-xl !border-red-700 !bg-red-700 !px-5 !text-white hover:!border-red-600 hover:!bg-red-600"
            >
              Quay lại lịch sử vé
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const qrValue = JSON.stringify({
    bookingId: booking._id,
    ticketCode,
    movieName,
    date: showDate,
    time: showTime,
    seats: seatCodes,
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm font-semibold text-red-200 transition hover:border-red-700 hover:bg-red-900/40"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <Tag className="!mr-0 rounded-full border border-green-700/50 bg-green-950/30 px-4 py-1.5 text-green-300">
          {bookingStatus}
        </Tag>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="overflow-hidden rounded-[28px] border border-red-900/40 bg-gradient-to-br from-[#0f0f10] via-[#1a0b0b] to-[#120909] shadow-2xl shadow-red-950/30">
          <div className="border-b border-red-900/40 bg-gradient-to-r from-red-950/70 to-transparent px-6 py-5 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                  Movie Ticket
                </p>
                <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                  {movieName}
                </h1>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-red-800/50 bg-red-950/30 px-3 py-1.5">
                <Ticket size={15} className="text-red-300" />
                <span className="font-mono text-xs font-bold tracking-[0.15em] text-red-200">
                  {ticketCode}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 md:px-8 lg:grid-cols-[1fr_260px]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-red-400">
                    <CalendarDays size={15} />
                    Ngày chiếu
                  </div>
                  <p className="text-base font-bold text-white">{showDate}</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-red-400">
                    <Clock3 size={15} />
                    Giờ chiếu
                  </div>
                  <p className="text-base font-bold text-white">{showTime}</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-red-400">
                    <Building2 size={15} />
                    Rạp / Phòng
                  </div>
                  <p className="text-base font-bold text-white">{cinemaName}</p>
                  <p className="mt-1 text-sm text-gray-400">{roomName}</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-red-400">
                    <Armchair size={15} />
                    Ghế
                  </div>
                  <p className="text-base font-bold text-white">{seatCodes}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-red-900/40 bg-gradient-to-r from-red-950/30 to-transparent p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-red-300">
                  <CreditCard size={16} />
                  Thanh toán
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Phương thức</p>
                    <p className="mt-1 font-semibold text-white">{paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Tổng tiền</p>
                    <p className="mt-1 text-lg font-black text-red-400">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {booking?.items?.length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-red-300">
                    <Popcorn size={16} />
                    Bắp nước / Combo
                  </div>

                  <div className="space-y-2">
                    {booking.items.map((item: any, index: number) => (
                      <div
                        key={`${item?.snackDrinkId || index}`}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-2"
                      >
                        <div>
                          <p className="font-semibold text-white">{item?.name || 'Sản phẩm'}</p>
                          <p className="text-xs text-gray-500">SL: {item?.quantity || 1}</p>
                        </div>
                        <p className="font-semibold text-red-300">
                          {formatCurrency((item?.price || 0) * (item?.quantity || 1))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/10 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-emerald-400" size={18} />
                  <div>
                    <p className="font-semibold text-emerald-300">Vé hợp lệ</p>
                    <p className="mt-1 text-sm text-gray-400">
                      Vui lòng đưa mã QR này cho nhân viên tại quầy hoặc cổng kiểm soát để xác
                      nhận vé.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start gap-4">
              <div className="w-full rounded-[24px] border border-red-900/40 bg-black/20 p-5 text-center">
                <div className="mb-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-red-300">
                  <QrCode size={16} />
                  Mã QR vé
                </div>

                <div className="mx-auto flex w-fit items-center justify-center rounded-2xl bg-white p-4 shadow-xl">
                  <QRCode value={qrValue} size={180} />
                </div>

                <p className="mt-4 break-all font-mono text-xs text-gray-400">{ticketCode}</p>
              </div>

              <div className="w-full rounded-[24px] border border-white/5 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-red-300">
                  <MapPin size={16} />
                  Thông tin đặt vé
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Mã booking</p>
                    <p className="mt-1 break-all font-mono text-white">{booking._id}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Thời gian đặt</p>
                    <p className="mt-1 text-white">{bookingCreatedAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-red-900/40 bg-gradient-to-br from-[#111112] to-[#1a0d0d] p-6">
            <h3 className="mb-4 text-lg font-black text-white">Lưu ý khi xem vé</h3>

            <div className="space-y-3 text-sm text-gray-400">
              <p>• Có mặt trước giờ chiếu ít nhất 15 phút.</p>
              <p>• Chuẩn bị sẵn mã QR hoặc ticket code khi check-in.</p>
              <p>• Không chia sẻ mã vé cho người khác.</p>
              <p>• Nếu gặp sự cố, liên hệ nhân viên rạp để được hỗ trợ.</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/5 bg-white/[0.03] p-6">
            <h3 className="mb-4 text-lg font-black text-white">Thao tác nhanh</h3>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/profile/tickets')}
                className="rounded-xl bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-red-500 hover:text-white"
              >
                Về lịch sử vé
              </button>

              <button
                onClick={() => navigate('/movielist')}
                className="rounded-xl border border-red-800 bg-red-950/20 px-4 py-3 text-sm font-black uppercase tracking-[0.15em] text-red-300 transition hover:border-red-700 hover:bg-red-900/30"
              >
                Đặt thêm vé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;