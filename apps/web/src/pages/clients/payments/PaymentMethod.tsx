import { useBooking } from "@web/hooks/useBooking";
import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { CheckCircle2 } from "lucide-react";

const PaymentsMethod = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { createPaymentUrl } = useBooking();

  const bookingId = location.state?.bookingId;
  const totalAmount = location.state?.totalAmount || 0;
  const seats = location.state?.seats || [];
  const movieInfo = location.state?.movieInfo;
  const isProcessing = useRef(false);

  useEffect(() => {
    if (!bookingId) {
      message.error("Không tìm thấy thông tin đơn hàng!");
      navigate("/");
    }
  }, [bookingId, navigate]);

  const handlePurchase = async () => {
    if (!bookingId) {
      message.error("Không tìm thấy thông tin đơn hàng!");
      return;
    }

    // 🔒 lock request
    if (isProcessing.current) return;
    isProcessing.current = true;

    setLoading(true);

    try {
      const paymentUrl = await createPaymentUrl(bookingId);

      window.location.href = paymentUrl;
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo link thanh toán!");
      isProcessing.current = false; // mở lock nếu lỗi
      setLoading(false);
    }
  };
  return (
    <div className="min-h-auto bg-[#120d0d] text-white ">
      <main className="max-w-7xl mx-auto py-8 px-5">
        <div className="flex flex-col lg:flex-row gap-12">
          <Outlet />

          <aside className="w-full lg:w-1/3">
            <div className="sticky top-12 space-y-6">
              <div className="summary-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <h3 className="text-2xl font-black mb-8">Order Summary</h3>

                <div className="space-y-6 mb-8">
                  {/* {MOCK_ORDER_DATA.items.map((item) => ( */}
                  <div
                    // key={item.id}
                    className="flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                        {/* <item.icon className="w-5 h-5" /> */}
                      </div>
                      <div>
                        <p className="font-bold">
                          {seats.join(", ") || "Seats"}
                        </p>
                        <p
                          className={`text-[10px] text-white/40 uppercase tracking-widest `}
                        >
                          {movieInfo?.ten_phim || "Movie"}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-white/80">
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                  {/* ))} */}

                  <div className="flex justify-between items-center border-t border-white/5 pt-6">
                    <p className="text-white/40 font-medium">Service Fee</p>
                    <span className="font-bold text-white/40">00 VNĐ</span>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-white/10 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">
                        Total Amount
                      </p>
                      <p className="text-4xl font-black">
                        {totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded uppercase tracking-tighter">
                      {bookingId?.slice(-8) || "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className={`w-full py-5 text-white rounded-[1.25rem] flex items-center justify-center gap-3 font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#ff3e47] to-[#ea2a33] hover:from-[#ff555d] hover:to-[#ff3e47] shadow-primary/40"
                  }`}
                >
                  <span>{loading ? "Processing..." : "Complete Purchase"}</span>
                  <CheckCircle2 className="w-6 h-6" />
                </button>

                <p className="text-center mt-6 text-xs text-white/30">
                  By clicking complete purchase, you agree to our{" "}
                  <a className="underline hover:text-white" href="#">
                    Terms of Service
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                <img
                  alt="Movie Thumbnail"
                  className="w-16 h-20 object-cover rounded-xl"
                  src={
                    movieInfo?.poster.url ||
                    "https://via.placeholder.com/80x100"
                  }
                />
                <div>
                  <p className="font-bold text-sm">
                    {movieInfo?.ten_phim || "Movie Title"}
                  </p>
                  <p className="text-xs text-white/50">
                    {seats.join(", ") || "No seats selected"}
                  </p>
                  <p className="text-xs text-primary font-bold mt-1 uppercase tracking-tighter">
                    {movieInfo?.cinema || "Cinema"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
export default PaymentsMethod;
