import { message } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API } from "@web/api/api.service";
import dayjs from "dayjs";
import { axiosAuth } from "@web/hooks/useAuth";

// Định nghĩa kiểu dữ liệu để hiển thị
interface BookingDetail {
  seatCodes: string[];
  movieName: string;
  totalAmount: number;
  finalAmount: number;
  ticketCode: string;
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

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | "processing">(
    "processing",
  );
  const [bookingInfo, setBookingInfo] = useState<BookingDetail | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      const responseCode = searchParams.get("vnp_ResponseCode");
      const bookingId = searchParams.get("vnp_TxnRef");

      if (responseCode === "00" && bookingId) {
        try {
          // ĐỔI Ở ĐÂY: Dùng axiosAuth để tự động đính kèm Token
          const { data } = await axiosAuth.get(
            `${API.BOOKING}/detail/${bookingId}`,
          );

          if (data.success) {
            setBookingInfo(data.data);
            setStatus("success");
            message.success("Thanh toán thành công!");
          }
        } catch (error) {
          console.error("Lỗi lấy thông tin vé:", error);
          setStatus("error");
        }
      } else {
        setStatus("error");
        message.error("Giao dịch thất bại.");
      }
      setLoading(false);
    };

    processPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-zinc-400">Đang xác thực giao dịch...</p>
          </div>
        ) : (
          <div className="text-center">
            {status === "success" ? (
              <>
                <div className="h-16 w-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Thanh toán thành công!
                </h2>

                {/* HIỂN THỊ DỮ LIỆU GHẾ VÀ PHIM Ở ĐÂY */}
                {bookingInfo && (
                  <div className="mt-8 relative animate-in fade-in zoom-in duration-500">
                    {/* Phần trên của vé */}
                    <div className="bg-zinc-800 rounded-t-2xl p-6 border-x border-t border-zinc-700 relative">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
                            Phim
                          </p>
                          <h3 className="text-xl font-bold text-white leading-tight">
                            {bookingInfo.showTimeId.movieId.ten_phim}
                          </h3>
                        </div>
                        <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                          2D PHỤ ĐỀ
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">
                            Ngày chiếu
                          </p>
                          <p className="font-semibold text-sm">
                            {dayjs(bookingInfo.showTimeId.startTime).format(
                              "DD/MM/YYYY",
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">
                            Giờ chiếu
                          </p>
                          <p className="font-semibold text-sm text-red-500">
                            {dayjs(bookingInfo.showTimeId.startTime).format(
                              "HH:mm",
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">
                            Rạp / Phòng
                          </p>
                          <p className="font-semibold text-sm">
                            {bookingInfo.showTimeId.roomId?.cinema_id?.name} -{" "}
                            {bookingInfo.showTimeId.roomId?.ten_phong}
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">Ghế ngồi</p>
                          <p className="font-semibold text-sm text-green-500">
                            {bookingInfo.seatCodes.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Đường gân xé vé (Tạo hình răng cưa bằng CSS) */}
                    <div className="relative h-4 bg-zinc-800 border-x border-zinc-700 flex items-center overflow-hidden">
                      <div className="absolute -left-2 w-4 h-4 bg-[#0a0a0f] rounded-full border-r border-zinc-700"></div>
                      <div className="w-full border-b-2 border-dashed border-zinc-600 mx-4"></div>
                      <div className="absolute -right-2 w-4 h-4 bg-[#0a0a0f] rounded-full border-l border-zinc-700"></div>
                    </div>

                    {/* Phần dưới của vé (Cuống vé) */}
                    <div className="bg-zinc-800 rounded-b-2xl p-6 border-x border-b border-zinc-700 text-center">
                      <p className="text-zinc-500 text-xs mb-2">
                        Mã vào phòng chiếu
                      </p>
                      <div className="bg-white p-2 rounded-lg inline-block mb-3">
                        {/* Giả lập mã vạch hoặc Text mã vé */}
                        <p className="text-black font-mono font-bold tracking-[0.2em] text-lg">
                          {bookingInfo.ticketCode}
                        </p>
                      </div>
                      <p className="text-zinc-400 text-[10px]">
                        Vui lòng đưa mã này cho nhân viên tại quầy soát vé
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate("/profile/tickets")}
                  className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Xem vé của tôi
                </button>
              </>
            ) : (
              // UI Thất bại giữ nguyên...
              <div className="py-6">
                <h2 className="text-red-500 text-xl font-bold">
                  Giao dịch không thành công
                </h2>
                <button
                  onClick={() => navigate("/")}
                  className="mt-6 text-zinc-400 hover:text-white underline"
                >
                  Quay lại trang chủ
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VNPayReturn;
