import { XCircle, Home, RefreshCw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId =
    searchParams.get("bookingId") || searchParams.get("vnp_TxnRef");

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-[28px] p-10 text-center">
      <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400">
        <XCircle className="h-12 w-12" />
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight">
        Thanh toán thất bại
      </h1>
      <p className="mt-3 text-sm md:text-base text-white/60">
        Giao dịch của bạn không thành công. Vui lòng thử lại hoặc chọn phương
        thức khác
      </p>
      {bookingId && (
        <div className="mt-4 text-xs text-white/50">
          Booking ID:{" "}
          <span className="font-mono text-white/80">
            {bookingId.slice(-8).toUpperCase()}
          </span>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/payments")}
          className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition"
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </button>
        <button
          onClick={() => navigate("/")}
          className="py-3 rounded-xl bg-gradient-to-r from-[#ff3e47] to-[#ea2a33] text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition"
        >
          <Home className="h-4 w-4" />
          Vào trang chủ
        </button>
      </div>
    </div>
  );
};
