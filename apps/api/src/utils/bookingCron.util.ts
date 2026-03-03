import { SeatTime } from "@api/modules/cinema-catalog/showtime/showtimeSeat.model";
import { Booking } from "@api/modules/sales-operations/booking/booking.model";
import mongoose from "mongoose";
import cron from "node-cron";

let isProcessing = false;
export const initBookingCron = () => {
  // Chạy mỗi phút 1 lần
  cron.schedule("*/1 * * * *", async () => {
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

        // 2. Cập nhật Booking sang trạng thái 'expired'
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
            $unset: { heldBy: "", holdExpiresAt: "", bookingId: "" }, // Xóa luôn link tới booking
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

  console.log("--- Booking Cron Job đã được khởi tạo thành công ---");
};
