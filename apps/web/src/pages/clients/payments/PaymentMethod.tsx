import { useBooking } from "@web/hooks/useBooking";
import { useState, useEffect } from "react";
import {
  useLocation,
  useNavigate,
  useOutlet,
  useSearchParams,
} from "react-router-dom";
import { message } from "antd";
import { API } from "@web/api/api.service";
import { axiosAuth } from "@web/hooks/useAuth";
import dayjs from "dayjs";

interface BookingDetail {
  seatCodes: string[];
  totalAmount: number;
  finalAmount: number;
  ticketCode: string;
  holdToken?: string;
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
  const [method, setMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const [searchParams] = useSearchParams();
  const { createPaymentUrl } = useBooking();
  const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(
    null,
  );
  const [bookingLoading, setBookingLoading] = useState(false);
  const holdTokenState = location.state?.holdToken;

  const bookingIdState = location.state?.bookingId;
  const bookingIdParam =
    searchParams.get("bookingId") ||
    searchParams.get("vnp_TxnRef") ||
    searchParams.get("orderId");
  const activeBookingId = bookingIdState || bookingIdParam;
  const holdToken = holdTokenState || bookingDetail?.holdToken;

  const totalAmount =
    location.state?.totalAmount ??
    bookingDetail?.finalAmount ??
    bookingDetail?.totalAmount ??
    0;
  const seats = location.state?.seats || bookingDetail?.seatCodes || [];
  const movieInfo = location.state?.movieInfo;
  const showtimeText =
    movieInfo?.showtime ||
    (bookingDetail?.showTimeId?.startTime
      ? dayjs(bookingDetail.showTimeId.startTime).format("HH:mm - DD/MM/YYYY")
      : "Showtime");

  useEffect(() => {
    if (outlet) return;
    if (!activeBookingId) {
      message.error("Không tìm thấy thông tin đơn hàng!");
      navigate("/");
    }
  }, [activeBookingId, navigate, outlet]);

  useEffect(() => {
    if (!activeBookingId) return;
    setBookingLoading(true);
    axiosAuth
      .get(`${API.BOOKING}/detail/${activeBookingId}`)
      .then((res) => {
        if (res.data?.success)
          setBookingDetail({
            ...res.data.data,
            holdToken: res.data.data.holdToken,
          });
      })
      .catch((error) => console.error("Load booking detail failed:", error))
      .finally(() => setBookingLoading(false));
  }, [activeBookingId]);

  const handlePurchase = async () => {
    if (loading) return;
    if (!activeBookingId) {
      message.error("Không tìm thấy thông tin đơn hàng!");
      return;
    }

    if (!holdToken) {
      message.error("Phiên giữ ghế không hợp lệ. Vui lòng đặt lại.");
      return;
    }

    if (method !== "vnpay" && method !== "momo") {
      message.info("Phương thức này chưa được hỗ trợ.");
      return;
    }

    setLoading(true);
    try {
      const paymentUrl = await createPaymentUrl({
        bookingId: activeBookingId,
        holdToken: holdToken,
        method,
      });
      if (!paymentUrl) {
        message.error("Không nhận được link thanh toán");
        return;
      }

      window.location.href = paymentUrl;
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo link thanh toán!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-auto text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.12),rgba(0,0,0,0)_55%),radial-gradient(ellipse_at_left,rgba(255,255,255,0.06),rgba(0,0,0,0)_45%)]" />

      <div className="mx-auto max-w-7xl px-4 pt-10 pb-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* LEFT */}
          <div>
            {outlet ? (
              <>{outlet}</>
            ) : (
              <>
                <div className="text-3xl uppercase font-extrabold">
                  Payments
                </div>

                {/* PAYMENT METHOD */}
                <div className="mt-8">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 text-xs flex items-center justify-center">
                      1
                    </span>
                    <div className="text-xs tracking-[0.25em] text-zinc-300 font-semibold">
                      PAYMENT METHOD
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {/* VNPay Button */}
                    <button
                      type="button"
                      onClick={() => setMethod("vnpay")}
                      className={`p-4 rounded-2xl border transition-all ${method === "vnpay" ? "border-red-500 bg-red-500/10" : "border-white/10 bg-white/5"}`}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-widest">
                        VNPay
                      </div>
                      <div className="text-[9px] text-zinc-500 mt-1">
                        Nội địa & Quốc tế
                      </div>
                    </button>

                    {/* Giả định thêm Momo */}
                    <button
                      type="button"
                      onClick={() => setMethod("momo")}
                      className={`p-4 rounded-2xl border transition-all ${method === "momo" ? "border-pink-500 bg-pink-500/10" : "border-white/10 bg-white/5"}`}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-widest">
                        MoMo
                      </div>
                      <div className="text-[9px] text-zinc-500 mt-1">
                        Ví điện tử MoMo
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod("atm")}
                      className={`p-4 rounded-2xl border transition-all ${method === "atm" ? "border-amber-500 bg-amber-500/10" : "border-white/10 bg-white/5"}`}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-widest">
                        ATM
                      </div>
                      <div className="text-[9px] text-zinc-500 mt-1">
                        Thẻ ATM nội địa
                      </div>
                    </button>
                  </div>
                </div>

                {/* CARD DETAILS - Chỉ hiện nếu không dùng VNPay/Momo (tùy bạn thiết kế) */}
                <div className="mt-8">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 text-xs flex items-center justify-center">
                      2
                    </span>
                    <div className="text-xs tracking-[0.25em] text-zinc-300 font-semibold">
                      ORDER CONFIRMATION
                    </div>
                  </div>

                  <div className="mt-4 rounded-[26px] border border-white/10 bg-white/5 p-6">
                    <p className="text-sm text-zinc-400">
                      Bạn đang thực hiện thanh toán qua cổng{" "}
                      <strong>{method.toUpperCase()}</strong>. Sau khi nhấn nút
                      "Complete Purchase", bạn sẽ được chuyển hướng an toàn đến
                      trang thanh toán chính thức.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="space-y-4">
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">Order Summary</div>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-red-600/15 border border-red-500/20" />
                    <div>
                      <div className="font-semibold">
                        Tickets ({seats.length}x)
                      </div>
                      <div className="text-xs text-zinc-500">
                        {seats.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="text-zinc-200 font-semibold">
                    {totalAmount.toLocaleString("vi-VN")} đ
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] tracking-[0.25em] text-red-400 font-semibold">
                      TOTAL AMOUNT
                    </div>
                    <div className="mt-1 text-3xl font-extrabold">
                      {totalAmount.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-500 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
                    VND
                  </div>
                </div>

                {!outlet && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handlePurchase}
                    className={`mt-3 w-full rounded-2xl bg-red-600 hover:bg-red-500 transition py-3 font-semibold shadow-[0_0_40px_rgba(239,68,68,0.22)] ${loading ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {loading ? "Processing..." : "Complete Purchase"}
                  </button>
                )}

                <div className="text-[10px] text-zinc-500 text-center leading-relaxed">
                  Bằng cách nhấn hoàn tất, bạn đồng ý với{" "}
                  <span className="text-zinc-400 underline">
                    Điều khoản dịch vụ
                  </span>
                </div>
              </div>
            </div>

            {/* Movie Card */}
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 flex items-center gap-3">
              {movieInfo?.poster && (
                <img
                  src={movieInfo.poster}
                  alt={movieInfo.title}
                  className="h-16 w-12 rounded-xl object-cover border border-white/10"
                />
              )}
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">
                  {movieInfo?.title ||
                    bookingDetail?.showTimeId?.movieId?.ten_phim ||
                    "Movie"}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  {showtimeText}
                </div>
                {bookingDetail?.showTimeId?.roomId?.cinema_id?.name && (
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {bookingDetail.showTimeId.roomId.cinema_id.name} -{" "}
                    {bookingDetail.showTimeId.roomId.ten_phong}
                  </div>
                )}
              </div>
            </div>
            {bookingLoading && (
              <div className="text-xs text-zinc-500 text-center">
                Đang tải thông tin...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentsMethod;
