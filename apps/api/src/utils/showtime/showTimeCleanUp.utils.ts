import cron from "node-cron";
import mongoose from "mongoose";
import { ShowTimeM } from "@api/modules/cinema-catalog/showtime/showtime.model";
import { SeatTime } from "@api/modules/cinema-catalog/showtime/showtimeSeat.model";

export const initShowtimeCleanupCron = () => {
  // Chạy vào lúc 03:00 sáng mỗi ngày
  cron.schedule("0 3 * * *", async () => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Mốc thời gian: Hiện tại trừ đi 20 ngày
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - 20);

      //(endTime) trước mốc 20 ngày
      const oldShowtimes = await ShowTimeM.find({
        endTime: { $lt: thresholdDate },
      }).session(session);

      if (oldShowtimes.length > 0) {
        const idsToDelete = oldShowtimes.map((st) => st._id);

        await SeatTime.deleteMany(
          { showTimeId: { $in: idsToDelete } },
          { session },
        );

        // Xóa chính các Suất chiếu quá 20 ngày
        const result = await ShowTimeM.deleteMany(
          { _id: { $in: idsToDelete } },
          { session },
        );

        console.log(
          `[Showtime Cron]: Đã dọn dẹp ${result.deletedCount} suất chiếu cũ và các ghế liên quan.`,
        );
      }

      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) await session.abortTransaction();
      console.error("[Showtime Cron Error]:", error);
    } finally {
      session.endSession();
    }
  });
};
