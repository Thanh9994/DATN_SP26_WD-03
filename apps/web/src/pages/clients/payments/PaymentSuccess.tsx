import { CheckCircle2, Download, Home, Printer } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId =
    searchParams.get("bookingId") || searchParams.get("vnp_TxnRef");

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-[28px] p-10 text-center">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 mx-auto mb-6">
          <CheckCircle2 className="w-16 h-16" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-sm md:text-lg text-white/60">
            Your seats for{" "}
            <span className="text-white font-bold">Dune: Part Two</span> have
            been confirmed.
          </p>
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl inline-flex flex-col gap-1 items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            Booking ID
          </p>
          <p className="text-xl font-mono font-bold tracking-widest text-primary">
            {bookingId ? `#${bookingId.slice(-8).toUpperCase()}` : "#N/A"}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="py-4 bg-gradient-to-r from-[#ff3e47] to-[#ea2a33] hover:from-[#ff555d] hover:to-[#ff3e47] text-white rounded-xl flex items-center justify-center gap-3 font-black transition-all shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]">
            <Download className="w-5 h-5" />
            Download Ticket
          </button>
          <button className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center gap-3 font-bold transition-all">
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
          <button
            onClick={() => navigate("/")}
            className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center gap-3 font-bold transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>
        </div>

        <p className="mt-6 text-sm text-white/40 max-w-lg mx-auto">
          A confirmation email with your digital ticket and receipt has been
          sent to your registered email address.
        </p>
    </div>
  );
};
