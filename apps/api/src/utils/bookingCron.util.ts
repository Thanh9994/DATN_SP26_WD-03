import { SeatTime } from "@api/modules/cinema-catalog/showtime/showtimeSeat.model";
import { Booking } from "@api/modules/sales-operations/booking/booking.model";
import mongoose from "mongoose";
import cron from "node-cron";

/**
 * Quét và giải phóng các ghế đã hết hạn giữ (hold)
 * Chạy mỗi phút 1 lần
 */
export const initBookingCron = () => {
  // Biểu thức '*/1 * * * *' nghĩa là chạy mỗi phút một lần
  cron.schedule("*/1 * * * *", async () => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const now = new Date();

      const expiredBookings = await Booking.find({
        status: "pending",
        createdAt: { $lt: new Date(now.getTime() - 5 * 60 * 1000) },
      }).session(session);

      if (expiredBookings.length > 0) {
        const bookingIds = expiredBookings.map((b) => b._id);

        await Booking.updateMany(
          { _id: { $in: bookingIds } },
          { $set: { status: "expired" } },
          { session },
        );
        // Tìm và cập nhật các ghế đã hết hạn
        await SeatTime.updateMany(
          {
            showTimeId: { $in: expiredBookings.map((b) => b.showTimeId) },
            trang_thai: "hold",
            holdExpiresAt: { $lt: now },
          },
          {
            $set: { trang_thai: "empty" },
            $unset: { heldBy: "", holdExpiresAt: "" },
          },
          { session },
        );
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("[Cron Error]:", error);
    } finally {
      session.endSession();
    }
  });

  console.log("--- Booking Cron Job đã được khởi tạo ---");
};
