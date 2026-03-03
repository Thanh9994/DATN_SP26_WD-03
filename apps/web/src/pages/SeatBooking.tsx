import { useOutletContext, useSearchParams } from "react-router-dom";
import { Spin, message } from "antd";
import SeatMap from "@web/components/SeatMap";
import { IShowTimeSeat } from "@shared/schemas";
import { useBooking } from "@web/hooks/useBooking";
// Đường dẫn tới file hook của bạn
interface BookingContextType {
  selectedSeats: IShowTimeSeat[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<IShowTimeSeat[]>>;
}
const SeatBooking = () => {
  const [searchParams] = useSearchParams();
  const showtimeId = searchParams.get("showtimeId") || "";

  // 1. Sử dụng hook useBooking thay cho các useQuery/useMutation rời rạc
  const { seats, isLoading } = useBooking(showtimeId);
  const { selectedSeats, setSelectedSeats } =
    useOutletContext<BookingContextType>();

  // Lưu danh sách ghế đang chọn

  const handleSeatClick = (seat: IShowTimeSeat) => {
    setSelectedSeats((prev) => {
      const isExist = prev.find((s) => s._id === seat._id);
      if (isExist) return prev.filter((s) => s._id !== seat._id);
      if (prev.length >= 12) {
        message.warning("Tối đa 8 ghế mỗi lần đặt");
        return prev;
      }
      return [...prev, seat];
    });
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Spin size="large" tip="Đang tải...." fullscreen />
      </div>
    );

  return (
    <div className="min-h-auto mb-3 rounded-2xl bg-[#000000] text-white p-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Khu vực sơ đồ ghế */}
        <div className="lg:col-span-4">
          <SeatMap
            seats={seats}
            selectedSeatCodes={selectedSeats.map((s) => s.seatCode)}
            onSeatClick={handleSeatClick}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
