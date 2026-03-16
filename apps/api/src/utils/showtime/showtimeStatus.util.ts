import cron from "node-cron";
import { ShowTimeM } from "@api/modules/cinema-catalog/showtime/showtime.model";

const IMMUTABLE_STATUSES = ["cancelled", "sold_out"] as const;

export const initShowtimeStatusCron = () => {
  const runUpdate = async () => {
    const now = new Date();
    try {
      await ShowTimeM.updateMany(
        { status: { $nin: IMMUTABLE_STATUSES }, startTime: { $gt: now } },
        { $set: { status: "upcoming" } },
      );

      await ShowTimeM.updateMany(
        {
          status: { $nin: IMMUTABLE_STATUSES },
          startTime: { $lte: now },
          endTime: { $gte: now },
        },
        { $set: { status: "ongoing" } },
      );

      await ShowTimeM.updateMany(
        { status: { $nin: IMMUTABLE_STATUSES }, endTime: { $lt: now } },
        { $set: { status: "finished" } },
      );
    } catch (error) {
      console.error("[Showtime Status Cron Error]:", error);
    }
  };

  // Chạy 1 lần ngay khi khởi động
  runUpdate();

  // Chạy mỗi phút để cập nhật trạng thái theo thời gian thực
  cron.schedule("* * * * *", runUpdate);
};
