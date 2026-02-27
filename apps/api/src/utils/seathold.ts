import { SeatTime } from "@api/modules/showtime/showtimeSeat.model";
import cron from "node-cron";

cron.schedule("* * * * *", async () => {
  await SeatTime.updateMany(
    {
      trang_thai: "hold",
      holdExpiresAt: { $lt: new Date() },
    },
    {
      trang_thai: "empty",
      $unset: { heldBy: "", holdExpiresAt: "" },
    },
  );
});