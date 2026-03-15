import { startMovieStatusCron } from "./assets/movie.status";
import { initBookingCron } from "./booking/bookingCron.util";
import { initShowtimeCleanupCron } from "./showtime/showTimeCleanUp.utils";
import { initShowtimeStatusCron } from "./showtime/showtimeStatus.util";
import { initSeatHoldCron } from "./showtime/seathold.utils";

export const initAllCrons = () => {
  console.log("🕒 Đang khởi tạo các tiến trình chạy ngầm (Cron Jobs)");
  initBookingCron();
  startMovieStatusCron();
  initShowtimeCleanupCron();
  initShowtimeStatusCron();
  initSeatHoldCron();
};
