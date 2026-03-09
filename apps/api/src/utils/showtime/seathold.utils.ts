import { SeatTime } from "@api/modules/cinema-catalog/showtime/showtimeSeat.model";
import cron from "node-cron";

export const initSeatHoldCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const result = await SeatTime.updateMany(
        {
          trang_thai: "hold",
          holdExpiresAt: { $lt: new Date() },
        },
        {
          trang_thai: "empty",
          $unset: { heldBy: "", holdExpiresAt: "" },
        },
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Đã giải phóng ${result.modifiedCount} ghế hết hạn giữ`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi giải phóng ghế:", error);
    }
  });
  console.log("🕒 Cron job giải phóng ghế đã được khởi tạo (chạy mỗi phút)");
};
