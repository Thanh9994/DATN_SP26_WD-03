import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Spin, message } from 'antd';
import SeatMap from '@web/components/skeleton/SeatMap';
import { IBooking, IShowTimeSeat } from '@shared/schemas';
import { useBooking } from '@web/hooks/useBooking';
import { useEffect, useRef } from 'react';
import { useAuth } from '@web/hooks/useAuth';
// Đường dẫn tới file hook của bạn
interface BookingContextType {
  selectedSeats: IShowTimeSeat[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<IShowTimeSeat[]>>;
}
const SeatBooking = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isRestored = useRef(false);
  const showtimeId = searchParams.get('showtimeId') || '';
  // const movieId = searchParams.get("movieId") || "";

  if (!showtimeId) {
    return <div>Không tìm thấy suất chiếu</div>;
  }
  // 1. Sử dụng hook useBooking thay cho các useQuery/useMutation rời rạc
  const { seats, isLoading, pendingBooking } = useBooking(showtimeId) as {
    seats: IShowTimeSeat[];
    isLoading: boolean;
    pendingBooking: IBooking | null;
  };

  const { selectedSeats, setSelectedSeats } = useOutletContext<BookingContextType>();

  useEffect(() => {
    const hasPendingSeats = pendingBooking?.seatCodes && pendingBooking.seatCodes.length > 0;

    const hasSeatsData = seats && seats.length > 0;

    if (!isRestored.current && hasPendingSeats && hasSeatsData) {
      // Chắc chắn dùng seatCodes từ pendingBooking
      const seatCodes = pendingBooking.seatCodes;
      const restored = seats.filter((seat) => seatCodes.includes(seat.seatCode));

      setSelectedSeats(restored);
      isRestored.current = true;
    }
  }, [pendingBooking, seats, setSelectedSeats]);

  // console.log("pendingBooking", pendingBooking);
  // console.log("selectedSeats", selectedSeats);
  // console.log("seats", seats);

  useEffect(() => {
    isRestored.current = false;
    setSelectedSeats([]);
  }, [showtimeId, setSelectedSeats]);

  const handleSeatClick = (seat: IShowTimeSeat) => {
    // console.log('=== Debug Seat Click ===');
    // console.log('Ghế đang click:', seat.seatCode);
    // console.log('Trạng thái ghế (DB):', seat.trang_thai);
    // console.log('ID người giữ (heldBy):', seat.heldBy);
    // console.log('ID của bạn (user?._id):', user?._id);
    // console.log('So sánh ID:', seat.heldBy === user?._id ? 'KHỚP' : 'KHÔNG KHỚP');
    // console.log('========================');

    if (seat.trang_thai === 'booked') return;

    if (seat.trang_thai === 'hold' && seat.heldBy !== user?._id) {
      message.warning('Ghế này đang được người khác giữ');
      return;
    }

    setSelectedSeats((prev) => {
      const exist = prev.find((s) => s._id === seat._id);

      if (exist) {
        return prev.filter((s) => s._id !== seat._id);
      }

      if (prev.length >= 10) {
        message.warning('Tối đa 10 ghế mỗi lần đặt');
        return prev;
      }

      return [...prev, seat];
    });
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Spin size="large" tip="Đang tải...." fullscreen />
      </div>
    );

  return (
    <div className="min-h-auto mb-3 rounded-2xl bg-[#000000] p-5 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Khu vực sơ đồ ghế */}
        <div className="lg:col-span-4">
          <SeatMap
            seats={seats ?? []}
            selectedSeatCodes={selectedSeats.map((s) => s.seatCode)}
            onSeatClick={handleSeatClick}
            currentUserId={user?._id || ''}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
