import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { Booking } from "./booking.model";
import { getBookingAnalytics } from "@api/utils/booking/booking.analytics";
import { catchAsync } from "@api/utils/catchAsync";
import { AppError } from "@api/middlewares/error.middleware";

export const bookingController = {
  holdSeats: catchAsync(async (req, res, next) => {
    const { showTimeId, seats, userId } = req.body;

    if (!showTimeId || !seats || seats.length === 0) {
      return next(new AppError("Thiếu thông tin suất chiếu hoặc ghế", 400));
    }
    const result = await bookingService.holdSeats(showTimeId, seats, userId);
    res.status(201).json({
      success: true,
      message: "Ghế đã được giữ trong 5 phút. Vui lòng thanh toán.",
      data: {
        bookingId: result.booking._id,
        totalAmount: result.booking.totalAmount,
        expiresAt: result.expiresAt,
      },
    });
  }),

  confirmBooking: catchAsync(async (req, res, next) => {
    const { bookingId, paymentId } = req.body;

    if (!bookingId) {
      return next(new AppError("Không tìm thấy mã đặt vé", 400));
    }

    const result = await bookingService.confirmBooking(bookingId, paymentId);

    res.json({
      success: true,
      message: "Thanh toán thành công! Vé đã được gửi vào email.",
      data: result,
    });
  }),

  getBookingDetail: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate({
      path: "showTimeId",
      populate: { path: "movieId" },
    });

    if (!booking) {
      return next(new AppError("Không tìm thấy đơn hàng", 404));
    }

    res.json({
      success: true,
      data: booking,
    });
  }),

  cancelBooking: catchAsync(async (req, res) => {
    const { bookingId, userId } = req.body;

    await bookingService.cancelBooking(bookingId, userId);

    res.json({
      success: true,
      message: "Đã hủy giữ ghế thành công",
    });
  }),

  getDashboardStats: catchAsync(async (req, res) => {
    const { days = 7 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - Number(days));

    const stats = await getBookingAnalytics(startDate, endDate);

    const summary = stats.reduce(
      (acc, curr) => ({
        totalRevenue: acc.totalRevenue + curr.revenue,
        totalPaidOrders: acc.totalPaidOrders + curr.totalPaid,
        totalFailedOrders:
          acc.totalFailedOrders + curr.totalCancelled + curr.totalExpired,
      }),
      { totalRevenue: 0, totalPaidOrders: 0, totalFailedOrders: 0 },
    );

    res.status(200).json({
      success: true,
      summary,
      details: stats,
    });
  }),
};

// export const confirmBooking = async (req: Request, res: Response) => {
//   try {
//     const { bookingId, paymentId } = req.body;
//     if (!bookingId) {
//       return res.status(400).json({ message: "Không tìm thấy mã đặt vé" });
//     }
//     const result = await bookingService.confirmBooking(bookingId, paymentId);
//     return res.json({
//       message: "Thanh toán thành công! Vé đã được gửi vào email.",
//       data: result,
//     });
//   } catch (err: any) {
//     console.error("Confirm Booking Error:", err);
//     return res
//       .status(400)
//       .json({ message: err.message || "Xác nhận vé thất bại" });
//   }
// };
