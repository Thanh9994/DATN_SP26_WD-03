import { useOutletContext, useSearchParams } from 'react-router-dom';
import { App, Spin } from 'antd';
import SeatMap from '@web/components/skeleton/SeatMap';
import { IBooking, IShowTimeSeat } from '@shared/src/schemas';
import { useBooking } from '@web/hooks/useBooking';
import { useEffect, useRef } from 'react';
import { useAuth } from '@web/hooks/useAuth';

interface BookingContextType {
  selectedSeats: IShowTimeSeat[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<IShowTimeSeat[]>>;
}

const getRowIndex = (row: string) =>
  row
    .toUpperCase()
    .split('')
    .reduce((total, char) => total * 26 + char.charCodeAt(0) - 64, 0);

const SeatBooking = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isRestored = useRef(false);
  const showtimeId = searchParams.get('showtimeId') || '';
  const { modal, message: antdMessage } = App.useApp();

  if (!showtimeId) {
    return <div>Không tìm thấy suất chiếu</div>;
  }

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
      const seatCodes = pendingBooking.seatCodes;
      const restored = seats.filter((seat) => seatCodes.includes(seat.seatCode));

      setSelectedSeats(restored);
      isRestored.current = true;
    }
  }, [pendingBooking, seats, setSelectedSeats]);

  useEffect(() => {
    isRestored.current = false;
    setSelectedSeats([]);
  }, [showtimeId, setSelectedSeats]);

  const showSeatValidationModal = () => {
    modal.warning({
      centered: true,
      title: 'Thông báo',
      content: 'Bạn không thể chọn nhiều loại ghế một lúc hoặc ghế không liền kề quá 2 hàng',
      okText: 'Đã hiểu',
    });
  };

  const handleSeatClick = (seat: IShowTimeSeat) => {
    if (seat.trang_thai === 'booked') return;

    if (seat.trang_thai === 'hold' && seat.heldBy !== user?._id) {
      antdMessage.warning('Ghế này đang được người khác chọn hãy đợi 1 chút');
      return;
    }

    const exist = selectedSeats.find((selectedSeat) => selectedSeat._id === seat._id);

    if (exist) {
      setSelectedSeats((prev) => prev.filter((selectedSeat) => selectedSeat._id !== seat._id));
      return;
    }

    if (selectedSeats.length >= 10) {
      antdMessage.warning('Tối đa 10 ghế mỗi lần đặt');
      return;
    }

    const nextSelectedSeats = [...selectedSeats, seat];
    const seatTypes = new Set(nextSelectedSeats.map((selectedSeat) => selectedSeat.seatType));

    if (seatTypes.size > 1) {
      showSeatValidationModal();
      return;
    }

    const selectedRows = [
      ...new Set(nextSelectedSeats.map((selectedSeat) => selectedSeat.row)),
    ].sort((a, b) => getRowIndex(a) - getRowIndex(b));

    if (selectedRows.length > 2) {
      showSeatValidationModal();
      return;
    }

    if (
      selectedRows.length === 2 &&
      getRowIndex(selectedRows[1]) - getRowIndex(selectedRows[0]) !== 1
    ) {
      showSeatValidationModal();
      return;
    }

    setSelectedSeats(nextSelectedSeats);
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
        <div className="lg:col-span-4">
          <SeatMap
            seats={seats ?? []}
            selectedSeatCodes={selectedSeats.map((seatItem) => seatItem.seatCode)}
            onSeatClick={handleSeatClick}
            currentUserId={user?._id || ''}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
