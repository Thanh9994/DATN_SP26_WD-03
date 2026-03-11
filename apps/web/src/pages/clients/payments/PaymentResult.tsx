import { CheckCircle2, XCircle, Home, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@web/api/api.service";

export const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const code = searchParams.get("code");
  const bookingId = searchParams.get("bookingId");
  const transactionNo = searchParams.get("transactionNo");

  const isSuccess = code === "00";

  useEffect(() => {
    if (bookingId) {
      axios
        .get(`${API.BOOKING}/${bookingId}`)
        .then((res) => setBooking(res.data.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#120d0d] text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120d0d] text-white">
      <main className="mx-auto py-12 px-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
              isSuccess
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-16 h-16" />
            ) : (
              <XCircle className="w-16 h-16" />
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight">
              {isSuccess ? "Payment Successful!" : "Payment Failed"}
            </h1>
            <p className="text-xl text-white/60">
              {isSuccess
                ? `Your booking has been confirmed.`
                : "There was an issue processing your payment."}
            </p>
          </div>

          {bookingId && (
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl inline-flex flex-col gap-1 items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                Booking ID
              </p>
              <p className="text-xl font-mono font-bold tracking-widest text-primary">
                #{bookingId.slice(-8).toUpperCase()}
              </p>
            </div>
          )}

          {transactionNo && (
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl inline-flex flex-col gap-1 items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                Transaction No
              </p>
              <p className="text-lg font-mono font-bold text-white/80">
                {transactionNo}
              </p>
            </div>
          )}

          {booking && (
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
              <h3 className="font-bold text-lg mb-4">Booking Details</h3>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Seats:</span>
                <span className="font-bold">{booking.seatCodes?.join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Total Amount:</span>
                <span className="font-bold text-primary">
                  {booking.finalAmount?.toLocaleString()} VND
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Status:</span>
                <span
                  className={`font-bold ${
                    booking.status === "paid" ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {booking.status?.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-4 bg-gradient-to-r from-[#ff3e47] to-[#ea2a33] hover:from-[#ff555d] hover:to-[#ff3e47] text-white rounded-xl flex items-center justify-center gap-3 font-black transition-all shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </button>
          </div>

          {isSuccess && (
            <p className="text-sm text-white/40 max-w-sm">
              A confirmation email with your digital ticket has been sent to your
              registered email address.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};
