import { IShowTimeSeat } from "@shared/schemas";
import { useState } from "react";
import SeatMap from "./SeatMap";

export const BookingPage = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Giả lập dữ liệu từ Schema của bạn
  const mockData: IShowTimeSeat[] = [
    // Hàng A (Normal)
    ...Array.from({ length: 26 }, (_, i) => ({
      row: "A",
      number: i + 1,
      seatCode: `A${i + 1}`,
      loai_ghe: "normal" as any,
      trang_thai: "empty" as any,
      price: 80000,
    })),
    ...Array.from({ length: 26 }, (_, i) => ({
      row: "B",
      number: i + 1,
      seatCode: `B${i + 1}`,
      loai_ghe: "normal" as any,
      trang_thai: "empty" as any,
      price: 80000,
    })),
    ...Array.from({ length: 26 }, (_, i) => ({
      row: "C",
      number: i + 1,
      seatCode: `C${i + 1}`,
      loai_ghe: "normal" as any,
      trang_thai: "empty" as any,
      price: 80000,
    })),
    ...Array.from({ length: 26 }, (_, i) => ({
      row: "D",
      number: i + 1,
      seatCode: `D${i + 1}`,
      loai_ghe: "normal" as any,
      trang_thai: "empty" as any,
      price: 80000,
    })),
    ...Array.from({ length: 26 }, (_, i) => ({
      row: "E",
      number: i + 1,
      seatCode: `E${i + 1}`,
      loai_ghe: "normal" as any,
      trang_thai: "empty" as any,
      price: 80000,
    })),
    // Hàng B (VIP)
    ...Array.from({ length: 26 }, (_, i) => ({
      row: "G",
      number: i + 1,
      seatCode: `G${i + 1}`,
      loai_ghe: "vip" as any,
      trang_thai: i === 4 ? "booked" : ("empty" as any),
      price: 120000,
    })),
    // Hàng C (Couple)
    ...Array.from({ length: 12 }, (_, i) => ({
      row: "H",
      number: i + 1,
      seatCode: `H${i + 1}`,
      loai_ghe: "couple" as any,
      trang_thai: "empty" as any,
      price: 200000,
    })),
  ] as any;

  const handleSeatClick = (seat: IShowTimeSeat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat.seatCode)
        ? prev.filter((code) => code !== seat.seatCode)
        : [...prev, seat.seatCode],
    );
  };

  return (
    <div className="p-10 bg-black min-h-screen text-white">
      <SeatMap
        seats={mockData}
        selectedSeatCodes={selectedSeats}
        onSeatClick={handleSeatClick}
      />
      <div className="mt-4 text-center">
        Ghế đang chọn: {selectedSeats.join(", ") || "Chưa chọn"}
      </div>
    </div>
  );
};
