import cron from "node-cron";
import { calcMovieStatus } from "@shared/utils/movieStatus";
import { Movie } from "./movie.model";

export const startMovieStatusCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("🔄 Đang cập nhật trạng thái phim...");

      const movies = await Movie.find();

      for (const movie of movies) {
        const newStatus = calcMovieStatus(
          movie.ngay_cong_chieu,
          movie.ngay_ket_thuc,
        );

        if (movie.trang_thai !== newStatus) {
          movie.trang_thai = newStatus;
          await movie.save();
          console.log(`✅ Cập nhật phim "${movie.ten_phim}" → ${newStatus}`);
        }
      }

      console.log("✅ Hoàn thành cập nhật trạng thái phim");
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái phim:", error);
    }
  });
};
