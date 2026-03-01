import { SeatTime } from "@api/modules/cinema-catalog/showtime/showtimeSeat.model";
import cron from "node-cron";

/**
 * Quét và giải phóng các ghế đã hết hạn giữ (hold)
 * Chạy mỗi phút 1 lần
 */
export const initBookingCron = () => {
  // Biểu thức '*/1 * * * *' nghĩa là chạy mỗi phút một lần
  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = new Date();

      // Tìm và cập nhật các ghế đã hết hạn
      const result = await SeatTime.updateMany(
        {
          trang_thai: "hold",
          holdExpiresAt: { $lt: now },
        },
        {
          $set: {
            trang_thai: "empty",
          },
          $unset: {
            heldBy: "",
            holdExpiresAt: "",
          },
        },
      );

      if (result.modifiedCount > 0) {
        console.log(
          `[Cron] Đã giải phóng ${result.modifiedCount} ghế hết hạn.`,
        );
      }
    } catch (error) {
      console.error("[Cron Error] Lỗi khi giải phóng ghế:", error);
    }
  });

  console.log("--- Booking Cron Job đã được khởi tạo ---");
};
