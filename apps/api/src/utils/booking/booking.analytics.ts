import { Booking } from "@api/modules/sales-operations/booking/booking.model";
import { BookingStatus } from "@shared/schemas";

export const getBookingAnalytics = async (startDate: Date, endDate: Date) => {
  return await Booking.aggregate([
    {
      // 1. Lọc các đơn hàng trong khoảng thời gian yêu cầu
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      // 2. Nhóm theo ngày (định dạng YYYY-MM-DD)
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },

        // Thống kê đơn thành công và doanh thu
        totalPaid: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
        },
        revenue: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$finalAmount", 0] },
        },

        // Thống kê đơn bị hủy hoặc hết hạn
        totalCancelled: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        totalExpired: {
          $sum: { $cond: [{ $eq: ["$status", "expired"] }, 1, 0] },
        },

        // Tổng số đơn phát sinh trong ngày
        totalOrders: { $sum: 1 },
      },
    },
    {
      // 3. Sắp xếp theo thứ tự ngày tăng dần
      $sort: { _id: 1 },
    },
  ]);
};
