import { useBooking } from '@web/hooks/useBooking';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useOutlet, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { API } from '@web/api/api.service';
import { axiosAuth } from '@web/hooks/useAuth';
import dayjs from 'dayjs';
import { Info, ShieldCheck } from 'lucide-react';

interface BookingDetail {
  seatCodes: string[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  ticketCode: string;
  holdToken?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  showTimeId: {
    movieId: {
      ten_phim: string;
    };
    roomId: {
      ten_phong: string;
      cinema_id: {
        name: string;
      };
    };
    startTime: string;
  };
}

const PaymentsMethod = () => {
  const [method, setMethod] = useState('vnpay');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const [searchParams] = useSearchParams();
  const { createPaymentUrl } = useBooking();
  const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const holdTokenState = location.state?.holdToken;

  const bookingIdState = location.state?.bookingId;
  const bookingIdParam =
    searchParams.get('bookingId') || searchParams.get('vnp_TxnRef') || searchParams.get('orderId');
  const activeBookingId = bookingIdState || bookingIdParam;
  const holdToken = holdTokenState || bookingDetail?.holdToken;

  const baseTotalAmount = location.state?.totalAmount ?? bookingDetail?.totalAmount ?? 0;
  const discountAmount = location.state?.discountAmount ?? bookingDetail?.discountAmount ?? 0;
  const finalAmount =
    location.state?.finalAmount ??
    bookingDetail?.finalAmount ??
    Math.max(baseTotalAmount - discountAmount, 0);

  const seats = location.state?.seats || bookingDetail?.seatCodes || [];
  const snackItems = (location.state?.items || bookingDetail?.items || []) as Array<{
    name: string;
    quantity: number;
    price: number;
  }>;

  const snackTotal = snackItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const ticketAmount = Math.max(baseTotalAmount - snackTotal, 0);

  const movieInfo = location.state?.movieInfo;
  const showtimeText =
    movieInfo?.showtime ||
    (bookingDetail?.showTimeId?.startTime
      ? dayjs(bookingDetail.showTimeId.startTime).format('HH:mm - DD/MM/YYYY')
      : 'Showtime');

  useEffect(() => {
    if (outlet) return;
    if (!activeBookingId) {
      message.error('Khong tim thay thong tin don hang!');
      navigate('/');
    }
  }, [activeBookingId, navigate, outlet]);

  useEffect(() => {
    if (!activeBookingId) return;
    setBookingLoading(true);
    axiosAuth
      .get(`${API.BOOKING}/detail/${activeBookingId}`)
      .then((res) => {
        if (res.data?.success) {
          setBookingDetail({
            ...res.data.data,
            holdToken: res.data.data.holdToken,
          });
        }
      })
      .catch((error) => console.error('Load booking detail failed:', error))
      .finally(() => setBookingLoading(false));
  }, [activeBookingId]);

  const doPurchase = async () => {
    if (loading) return;

    if (!activeBookingId) {
      message.error('Khong tim thay thong tin don hang!');
      return;
    }

    if (!holdToken) {
      message.error('Phien giu ghe khong hop le. Vui long dat lai.');
      return;
    }

    if (method !== 'vnpay' && method !== 'momo') {
      message.info('Phuong thuc nay chua duoc ho tro.');
      return;
    }

    setLoading(true);
    try {
      const paymentUrl = await createPaymentUrl({
        bookingId: activeBookingId,
        holdToken,
        method,
      });

      if (!paymentUrl) {
        message.error('Khong nhan duoc link thanh toan');
        return;
      }

      window.location.href = paymentUrl;
    } catch {
      message.error('Co loi xay ra khi tao link thanh toan!');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const openConfirmModal = () => {
    if (loading) return;

    if (!activeBookingId) {
      message.error('Khong tim thay thong tin don hang!');
      return;
    }

    if (!holdToken) {
      message.error('Phien giu ghe khong hop le. Vui long dat lai.');
      return;
    }

    setConfirmOpen(true);
  };

  return (
    <div className="min-h-auto text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.12),rgba(0,0,0,0)_55%),radial-gradient(ellipse_at_left,rgba(255,255,255,0.06),rgba(0,0,0,0)_45%)]" />

      <div className="mx-auto max-w-7xl px-4 pb-28 pt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            {outlet ? (
              <>{outlet}</>
            ) : (
              <>
                <div className="text-3xl font-extrabold uppercase">Cổng Thanh toán</div>

                <div className="mt-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-xl border border-red-500/30 bg-red-600/15 text-xs text-red-300">
                      1
                    </span>
                    <div className="text-sm font-semibold tracking-[0.20em] text-zinc-300">
                      Phương thức Thanh toán
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setMethod('vnpay')}
                      className={`rounded-xl border p-4 transition-all ${method === 'vnpay' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5'}`}
                    >
                      <div className="text-sm font-semibold uppercase tracking-widest">VNPay</div>
                      <div className="mt-1 text-[9px] text-zinc-500">Noi dia & Quoc te</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod('momo')}
                      className={`rounded-xl border p-4 transition-all ${method === 'momo' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5'}`}
                    >
                      <div className="text-sm font-semibold uppercase tracking-widest">MoMo</div>
                      <div className="mt-1 text-[9px] text-zinc-500">Vi dien tu MoMo</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod('atm')}
                      className={`rounded-xl border p-4 transition-all ${method === 'atm' ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-white/5'}`}
                    >
                      <div className="text-sm font-semibold uppercase tracking-widest">ATM</div>
                      <div className="mt-1 text-[9px] text-zinc-500">The ATM noi dia</div>
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-red-500/30 bg-red-600/15 text-xs text-red-300">
                      2
                    </span>
                    <div className="text-sm font-semibold tracking-[0.20em] text-zinc-300">
                      Thông tin thanh toán
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 transition-all">
                    <div className="flex items-start gap-4">
                      {/* Icon bảo mật làm điểm nhấn */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                        <ShieldCheck size={24} />
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed text-zinc-300">
                          Bạn đang thực hiện thanh toán an toàn qua cổng
                          <span className="mx-1.5 font-bold text-white underline decoration-red-500/50 underline-offset-4">
                            {method.toUpperCase()}
                          </span>
                          .
                        </p>

                        <p className="text-xs leading-relaxed text-zinc-400">
                          Sau khi nhấn{' '}
                          <strong className="text-zinc-200">"Xác nhận thanh toán"</strong>, hệ thống
                          sẽ tự động chuyển hướng bạn đến trang xác thực chính thức của đối tác để
                          hoàn tất giao dịch.
                        </p>

                        {/* Dòng ghi chú nhỏ bên dưới */}
                        <div className="flex items-center gap-2 pt-2 text-[11px] font-medium text-amber-400/80">
                          <Info size={14} />
                          <span>
                            Vui lòng không làm mới (F5) trình duyệt trong quá trình xử lý.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hiệu ứng trang trí nhẹ ở góc */}
                    <div className="mt-4 flex items-center justify-end border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter text-zinc-500">
                        <span>Mã hóa bảo mật SSL</span>
                        <div className="h-1 w-1 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">Thành tiền</div>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg border border-red-500/20 bg-red-600/15" />
                    <div>
                      <div className="font-semibold">Tickets ({seats.length}x)</div>
                      <div className="text-xs text-zinc-500">{seats.join(', ') || '--'}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-zinc-200">
                    {ticketAmount.toLocaleString('vi-VN')} VND
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg border border-emerald-500/20 bg-emerald-600/15" />
                    <div>
                      <div className="font-semibold">Đồ uống & Combo</div>
                      <div className="text-xs text-zinc-500">
                        {snackItems.length
                          ? snackItems.map((item) => `${item.name} x${item.quantity}`).join(', ')
                          : 'Khong chon'}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-zinc-200">
                    {snackTotal.toLocaleString('vi-VN')} VND
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-2 rounded-xl p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-red-400">Tổng</span>
                    <span className="text-2xl font-extrabold">
                      {finalAmount.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                </div>

                {!outlet && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={openConfirmModal}
                    className={`mt-3 w-full rounded-2xl bg-red-600 py-3 font-semibold shadow-[0_0_40px_rgba(239,68,68,0.22)] transition hover:bg-red-500 ${loading ? 'cursor-wait opacity-50' : ''}`}
                  >
                    {loading ? 'Processing...' : 'Xác nhận thanh toán'}
                  </button>
                )}

                <div className="text-center text-[10px] leading-relaxed text-zinc-500">
                  Bằng cách hoàn tất, bạn đã đồng ý với{' '}
                  <span className="text-zinc-400 underline">Điều khoản dịch vụ</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
              {movieInfo?.poster && (
                <img
                  src={movieInfo.poster}
                  alt={movieInfo.title}
                  className="h-16 w-12 rounded-xl border border-white/10 object-cover"
                />
              )}
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {movieInfo?.title || bookingDetail?.showTimeId?.movieId?.ten_phim || 'Movie'}
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">{showtimeText}</div>
                {bookingDetail?.showTimeId?.roomId?.cinema_id?.name && (
                  <div className="mt-1 text-[11px] text-zinc-500">
                    {bookingDetail.showTimeId.roomId.cinema_id.name} -{' '}
                    {bookingDetail.showTimeId.roomId.ten_phong}
                  </div>
                )}
              </div>
            </div>

            {bookingLoading && (
              <div className="text-center text-xs text-zinc-500">Đang tải thông tin...</div>
            )}
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Xác nhận thanh toán</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Bạn sắp thanh toán qua <strong>{method.toUpperCase()}</strong> với số tiền{' '}
              <strong>{finalAmount.toLocaleString('vi-VN')} VND</strong>.
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Sau khi xác nhận, hệ thống sẽ chuyển sang cổng thanh toán.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/5"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={doPurchase}
                disabled={loading}
                className={`flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 ${loading ? 'cursor-wait opacity-60' : ''}`}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsMethod;
