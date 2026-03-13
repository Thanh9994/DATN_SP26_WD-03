import { SeatTime } from "@api/modules/cinema-catalog/showtime/showtimeSeat.model";
import { Booking } from "@api/modules/sales-operations/booking/booking.model";
import mongoose from "mongoose";
import cron from "node-cron";

let isProcessing = false;
export const initBookingCron = () => {
  // Chạy mỗi phút 30 sec lần
  cron.schedule("*/30 * * * *", async () => {
    const session = await mongoose.startSession();
    if (isProcessing) return;
    isProcessing = true;
    try {
      session.startTransaction();
      const now = new Date();
      // Sử dụng field holdExpiresAt để đồng bộ với logic giữ ghế
      const expiredBookings = await Booking.find({
        status: "pending",
        holdExpiresAt: { $lt: now },
      }).session(session);

      if (expiredBookings.length > 0) {
        const bookingIds = expiredBookings.map((b) => b._id);

        // Thu thập tất cả Seat IDs từ các booking hết hạn
        const allSeatIds = expiredBookings.flatMap((b) => b.seats);

        await Booking.updateMany(
          { _id: { $in: bookingIds } },
          { $set: { status: "expired" } },
          { session },
        );

        // 3. Giải phóng chính xác những ghế thuộc về các đơn hàng này
        await SeatTime.updateMany(
          {
            _id: { $in: allSeatIds },
            trang_thai: "hold",
          },
          {
            $set: { trang_thai: "empty" },
            $unset: { heldBy: "", holdExpiresAt: "", bookingId: "" },
          },
          { session },
        );

        console.log(
          `[Cron]: Đã xử lý ${bookingIds.length} đơn hàng và các ghế liên quan hết hạn.`,
        );
      }

      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error("[Cron Error]:", error);
    } finally {
      isProcessing = false;
      session.endSession();
    }
  });

  //"Xóa booking đã hủy/hết hạn sau 2 ngày"
  // Cleanup expired/cancelled bookings older than 2 days
  cron.schedule("0 * * * *", async () => {
    const session = await mongoose.startSession();
    if (isProcessing) return;
    isProcessing = true;
    try {
      session.startTransaction();
      const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

      const oldBookings = await Booking.find({
        status: { $in: ["expired", "cancelled"] },
        updatedAt: { $lt: cutoff },
      }).session(session);

      if (oldBookings.length > 0) {
        const bookingIds = oldBookings.map((b) => b._id);
        const allSeatIds = oldBookings.flatMap((b) => b.seats);

        await SeatTime.updateMany(
          {
            _id: { $in: allSeatIds },
            bookingId: { $in: bookingIds },
            trang_thai: "hold",
          },
          {
            $set: { trang_thai: "empty" },
            $unset: { heldBy: "", holdExpiresAt: "", bookingId: "" },
          },
          { session },
        );

        await Booking.deleteMany({ _id: { $in: bookingIds } }, { session });

        console.log(
          `[Cron]: Đã xóa ${bookingIds.length} đơn hàng hết hạn/đã hủy quá 2 ngày.`,
        );
      }

      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error("[Cron Error]:", error);
    } finally {
      isProcessing = false;
      session.endSession();
    }
  });
};
