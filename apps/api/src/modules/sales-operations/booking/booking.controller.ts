import { Request, Response } from "express";
import { bookingService } from "./booking.service";

export const holdSeats = async (req: Request, res: Response) => {
  try {
    const { showTimeId, seats, userId } = req.body;
    const result = await bookingService.holdSeats(showTimeId, seats, userId);
    return res.json({ message: "Giữ ghế thành công", data: result });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Lỗi giữ ghế" });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.confirmBooking(req.body);
    return res.json({ message: "Đặt vé thành công", data: result });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Lỗi xác nhận" });
  }
};
