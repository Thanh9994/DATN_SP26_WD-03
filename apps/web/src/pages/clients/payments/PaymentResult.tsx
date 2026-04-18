import { CheckCircle2, XCircle, Home, Loader2, User2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API } from '@web/api/api.service';
import { QRCodeCanvas } from 'qrcode.react';
import BookingTicket from '@web/components/BookingTicket';
import { ITicketCl, mapToTicketCl } from '@shared/src/schemas/ticket';

export const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const code = searchParams.get('code');
  const bookingId = searchParams.get('bookingId');

  const isSuccess = code === '00';
  const formatCurrency = (value: number) => `${Number(value || 0).toLocaleString('vi-VN')} VND`;

  const formatId = (value: any) => {
    if (!value) return '---';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.$oid) return value.$oid as string;
    return String(value);
  };

  const bookingIdValue = formatId(booking?._id || bookingId);
  const ticketCodeValue = formatId(booking?.ticketCode);
  const displayTicketCode =
    ticketCodeValue && ticketCodeValue !== '---'
      ? ticketCodeValue.toUpperCase()
      : `#${bookingIdValue.slice(-8).toUpperCase()}`;
  const userDisplayName =
    typeof booking?.userId === 'object'
      ? booking?.userId?.ho_ten || '---'
      : formatId(booking?.userId);

  const comboTotal = (booking?.items || []).reduce(
    (sum: number, item: any) => sum + Number(item?.price || 0) * Number(item?.quantity || 0),
    0,
  );

  const ticketData = useMemo<ITicketCl | null>(() => {
    if (!booking) return null;
    try {
      return mapToTicketCl(booking);
    } catch {
      return null;
    }
  }, [booking]);

  useEffect(() => {
    if (bookingId) {
      axios
        .get(`${API.BOOKING}/detail/${bookingId}`)
        .then((res) => setBooking(res.data.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-col items-center justify-center space-y-8 py-6 text-center">
        <div
          className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full ${
            isSuccess ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}
        >
          {isSuccess ? <CheckCircle2 className="h-16 w-16" /> : <XCircle className="h-16 w-16" />}
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-black tracking-tight">
            {isSuccess ? 'Thanh toán thành công!' : 'thanh toán thất bại'}
          </h1>
          <p className="text-xl text-white/60">
            {isSuccess
              ? `Vé của bạn đã được thanh toán thành công check vé trong lịch sử đặt vé.`
              : 'There was an issue processing your payment.'}
          </p>
        </div>
        {isSuccess && booking && ticketData && (
          <div className="w-full max-w-4xl space-y-5">
            <BookingTicket ticket={ticketData}>
              <div className="flex flex-row items-start gap-6">
                {/* QR code bên trái */}
                <div className="flex flex-col items-center">
                  {booking.qrCodeDataUrl ? (
                    <img
                      src={booking.qrCodeDataUrl}
                      alt="Ticket QR"
                      className="h-44 w-44 rounded-lg bg-white p-2 shadow-lg"
                    />
                  ) : (
                    <QRCodeCanvas
                      value={bookingIdValue}
                      size={220}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin={true}
                      className="rounded-lg bg-white p-2 shadow-lg"
                    />
                  )}
                  <p className="mt-3 text-xs text-white/50">TicketCode: {displayTicketCode}</p>
                </div>
                <div className="h-44 w-px bg-white/20"></div>
                {/* Thông tin người đặt và tổng thanh toán bên phải */}
                <div className="flex flex-col justify-center gap-4 p-3 text-left">
                  <div className="flex flex-row items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      Người đặt:
                    </p>
                    <p className="text-sm font-bold text-white">{userDisplayName}</p>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      Voucher giảm giá:
                    </p>
                    <p className="text-sm font-bold text-white">-0 VND</p>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      Tổng combo:
                    </p>
                    <p className="text-sm font-bold text-white">{formatCurrency(comboTotal)}</p>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      Tổng đã thanh toán:
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {formatCurrency(booking.finalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </BookingTicket>
          </div>
        )}

        <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate('/')}
            className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#ff3e47] to-[#ea2a33] py-4 font-black text-white shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] hover:from-[#ff555d] hover:to-[#ff3e47] active:scale-[0.98]"
          >
            <Home className="h-5 w-5" />
            Trang chủ
          </button>
          <button
            onClick={() => navigate('/profile/tickets')}
            className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#ff3e47] to-[#ea2a33] py-4 font-black text-white shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] hover:from-[#ff555d] hover:to-[#ff3e47] active:scale-[0.98]"
          >
            <User2 className="h-5 w-5" />
            Xem vé của tôi
          </button>
        </div>

        {isSuccess && (
          <p className="max-w-sm text-sm text-white/40">
            Một email xác nhận kèm vé điện tử đã được gửi đến địa chỉ email mà bạn đã đăng ký.
          </p>
        )}
      </div>
    </div>
  );
};
