import { startMovieStatusCron } from "./movie.status";
import { initBookingCron } from "./bookingCron.util";

export const initAllCrons = () => {
  console.log("--- 🕒 Đang khởi tạo các tiến trình chạy ngầm (Cron Jobs) ---");
  initBookingCron();
  startMovieStatusCron();
};
