import { CheckCircle2, Download, Home, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-2/3 flex flex-col items-center justify-center text-center space-y-8 py-12">
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
        <CheckCircle2 className="w-16 h-16" />
      </div>

      <div className="space-y-3">
        <h1 className="text-5xl font-black tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-xl text-white/60">
          Your seats for{" "}
          <span className="text-white font-bold">Dune: Part Two</span> have been
          confirmed.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl inline-flex flex-col gap-1 items-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          Booking ID
        </p>
        <p className="text-xl font-mono font-bold tracking-widest text-primary">
          #CS-8829-XQ2
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
        <button className="flex-1 py-4 bg-gradient-to-r from-[#ff3e47] to-[#ea2a33] hover:from-[#ff555d] hover:to-[#ff3e47] text-white rounded-xl flex items-center justify-center gap-3 font-black transition-all shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]">
          <Download className="w-5 h-5" />
          Download Ticket
        </button>
        <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center gap-3 font-bold transition-all">
          <Printer className="w-5 h-5" />
          Print Receipt
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center gap-3 font-bold transition-all"
        >
          <Home className="w-5 h-5" />
          Go to Home
        </button>
      </div>

      <p className="text-sm text-white/40 max-w-sm">
        A confirmation email with your digital ticket and receipt has been sent
        to your registered email address.
      </p>
    </div>
  );
};
