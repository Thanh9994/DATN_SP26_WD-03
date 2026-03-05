import { startMovieStatusCron } from "./movie.status";
import { initBookingCron } from "./booking/bookingCron.util";
import { initShowtimeCleanupCron } from "./showtime/showTimeCleanUp.utils";
import { initSeatHoldCron } from "./showtime/seathold.utils";

export const initAllCrons = () => {
  console.log("--- 🕒 Đang khởi tạo các tiến trình chạy ngầm (Cron Jobs) ---");
  initBookingCron();
  startMovieStatusCron();
  initShowtimeCleanupCron();
  initSeatHoldCron();
};
