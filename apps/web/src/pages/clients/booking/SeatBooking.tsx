import { useOutletContext, useSearchParams } from "react-router-dom";
import { Spin, message } from "antd";
import SeatMap from "@web/components/skeleton/SeatMap";
import { IShowTimeSeat } from "@shared/schemas";
import { useBooking } from "@web/hooks/useBooking";
import { useEffect } from "react";
// Đường dẫn tới file hook của bạn
interface BookingContextType {
  selectedSeats: IShowTimeSeat[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<IShowTimeSeat[]>>;
}
const SeatBooking = () => {
  const [searchParams] = useSearchParams();

  const showtimeId = searchParams.get("showtimeId") || "";
  // const movieId = searchParams.get("movieId") || "";

  if (!showtimeId) {
    return <div>Không tìm thấy suất chiếu</div>;
  }
  // 1. Sử dụng hook useBooking thay cho các useQuery/useMutation rời rạc
  const { seats, isLoading, pendingBooking } = useBooking(showtimeId) as {
    seats: IShowTimeSeat[];
    isLoading: boolean;
    pendingBooking: { seatCodes: string[] } | null;
  };

  const { selectedSeats, setSelectedSeats } =
    useOutletContext<BookingContextType>();

  useEffect(() => {
    if (!seats?.length) return;

    const seatCodes = pendingBooking?.seatCodes || [];

    if (!seatCodes.length) return;

    const restored = seats.filter((seat) => seatCodes.includes(seat.seatCode));

    setSelectedSeats(restored);
  }, [pendingBooking, seats, setSelectedSeats]);

  // console.log("pendingBooking", pendingBooking);
  // console.log("selectedSeats", selectedSeats);
  // console.log("seats", seats);

  const handleSeatClick = (seat: IShowTimeSeat) => {
    setSelectedSeats((prev) => {
      const exist = prev.find((s) => s._id === seat._id);

      if (exist) {
        return prev.filter((s) => s._id !== seat._id);
      }

      if (prev.length >= 10) {
        message.warning("Tối đa 10 ghế mỗi lần đặt");
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
            seats={seats ?? []}
            selectedSeatCodes={selectedSeats.map((s) => s.seatCode)}
            onSeatClick={handleSeatClick}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
