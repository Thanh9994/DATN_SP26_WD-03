import { BookingStatus, IPopulatedBooking } from "./index";
import { z } from "zod";
import dayjs from "dayjs";

// Enum status lấy từ schema của bạn

export const TicketCl = z.object({
  _id: z.string(),
  title: z.string(),
  image: z.string(),
  cinemaName: z.string(),
  roomName: z.string(),
  date: z.string(),
  time: z.string(),
  seatCodes: z.string(),
  status: BookingStatus,
  isPast: z.boolean(),
  type: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  totalAmount: z.number(),
  ticketCode: z.string(),
  qrValue: z.string(),
});

export type ITicketCl = z.infer<typeof TicketCl>;

// Hàm Mapper chuyển đổi dữ liệu từ Backend Populate thành Ticket Client

export const mapToTicketCl = (raw: IPopulatedBooking): ITicketCl => {
  const showTime = raw.showTimeId;
  const movie = showTime?.movieId;
  const room = showTime?.roomId;
  const cinema = room?.cinema_id;

  const startTime = showTime?.startTime ? dayjs(showTime.startTime) : dayjs();

  return {
    _id: raw._id?.toString() || (raw._id as string),
    title: movie?.ten_phim || "N/A",
    image: movie?.poster?.url || "",
    cinemaName: cinema?.name || "N/A",
    roomName: room?.ten_phong || "N/A",
    date: startTime.format("DD/MM/YYYY"),
    time: startTime.format("HH:mm"),
    type: room?.loai_phong || "2D",
    seatCodes: raw.seatCodes?.join(", ") || "",
    totalAmount: raw.finalAmount || 0,
    status: raw.status,
    ticketCode: raw.ticketCode || "N/A",
    isPast: startTime.isBefore(dayjs()),
    items:
      raw.items?.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })) || [],
    qrValue: `TICKET|${raw.ticketCode}|${raw._id}`, // Tạo giá trị cho mã QR
  };
};
