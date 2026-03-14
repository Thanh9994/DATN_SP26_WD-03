import { CheckCircle2, XCircle, Home, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '@web/api/api.service';

export const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const code = searchParams.get('code');
  const bookingId = searchParams.get('bookingId');
  const transactionNo = searchParams.get('transactionNo');

  const isSuccess = code === '00';

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
    <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8">
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
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
          <p className="text-xl text-white/60">
            {isSuccess
              ? `Your booking has been confirmed.`
              : 'There was an issue processing your payment.'}
          </p>
        </div>

        {bookingId && (
          <div className="inline-flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              Booking ID
            </p>
            <p className="font-mono text-xl font-bold tracking-widest text-primary">
              #{bookingId.slice(-8).toUpperCase()}
            </p>
          </div>
        )}

        {transactionNo && (
          <div className="inline-flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              Transaction No
            </p>
            <p className="font-mono text-lg font-bold text-white/80">{transactionNo}</p>
          </div>
        )}

        {booking && (
          <div className="w-full max-w-md space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h3 className="mb-4 text-lg font-bold">Booking Details</h3>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Seats:</span>
              <span className="font-bold">{booking.seatCodes?.join(', ')}</span>
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
                  booking.status === 'paid' ? 'text-green-500' : 'text-yellow-500'
                }`}
              >
                {booking.status?.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate('/')}
            className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#ff3e47] to-[#ea2a33] py-4 font-black text-white shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] hover:from-[#ff555d] hover:to-[#ff3e47] active:scale-[0.98]"
          >
            <Home className="h-5 w-5" />
            Go to Home
          </button>
        </div>

        {isSuccess && (
          <p className="max-w-sm text-sm text-white/40">
            A confirmation email with your digital ticket has been sent to your registered email
            address.
          </p>
        )}
      </div>
    </div>
  );
};
