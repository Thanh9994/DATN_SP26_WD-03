import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { Booking } from "./booking.model";
import { getBookingAnalytics } from "@api/utils/booking/booking.analytics";

export const holdSeats = async (req: Request, res: Response) => {
  try {
    const { showTimeId, seats, userId } = req.body;
    if (!showTimeId || !seats || seats.length === 0) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin suất chiếu hoặc ghế" });
    }
    const result = await bookingService.holdSeats(showTimeId, seats, userId);
    return res.status(201).json({
      message: "Ghế đã được giữ trong 5 phút. Vui lòng thanh toán.",
      data: {
        bookingId: result.booking._id,
        totalAmount: result.booking.totalAmount,
        expiresAt: result.expiresAt,
      },
    });
  } catch (err: any) {
    console.error("Hold Seats Error:", err);
    return res.status(400).json({ message: err.message || "Lỗi giữ ghế" });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId, paymentId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: "Không tìm thấy mã đặt vé" });
    }
    const result = await bookingService.confirmBooking(bookingId, paymentId);
    return res.json({
      message: "Thanh toán thành công! Vé đã được gửi vào email.",
      data: result,
    });
  } catch (err: any) {
    console.error("Confirm Booking Error:", err);
    return res
      .status(400)
      .json({ message: err.message || "Xác nhận vé thất bại" });
  }
};

export const getBookingDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("showTimeId")
      .populate({
        path: "showTimeId",
        populate: { path: "movieId" },
      });
    return res.json(booking);
  } catch (err) {
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId, userId } = req.body; // Trong thực tế lấy userId từ token
    await bookingService.cancelBooking(bookingId, userId);
    return res.json({ message: "Đã hủy giữ ghế thành công" });
  } catch (err) {
    return res.status(400).json({ message: "Lỗi khi hủy" });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { days = 7 } = req.query; // Mặc định thống kê 7 ngày gần nhất
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - Number(days));

    const stats = await getBookingAnalytics(startDate, endDate);

    // Tính toán tổng quan (Tổng doanh thu, tỉ lệ lấp đầy...)
    const summary = stats.reduce(
      (acc, curr) => ({
        totalRevenue: acc.totalRevenue + curr.revenue,
        totalPaidOrders: acc.totalPaidOrders + curr.totalPaid,
        totalFailedOrders:
          acc.totalFailedOrders + curr.totalCancelled + curr.totalExpired,
      }),
      { totalRevenue: 0, totalPaidOrders: 0, totalFailedOrders: 0 },
    );

    return res.status(200).json({
      success: true,
      summary,
      details: stats,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
