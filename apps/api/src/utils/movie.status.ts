import cron from "node-cron";
import { Movie } from "../modules/movie-content/movie/movie.model";
import { IMovieStatus } from "@shared/schemas";

export const startMovieStatusCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await Movie.updateMany(
        { ngay_ket_thuc: { $lt: today }, trang_thai: { $ne: "ngung_chieu" } },
        { $set: { trang_thai: "ngung_chieu" } },
      );

      await Movie.updateMany(
        {
          ngay_cong_chieu: { $lte: today },
          ngay_ket_thuc: { $gte: today },
          trang_thai: { $ne: "dang_chieu" },
        },
        { $set: { trang_thai: "dang_chieu" } },
      );

      console.log("✅ Cập nhật trạng thái phim hàng loạt thành công");
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái phim:", error);
    }
  });
};

export const calcMovieStatus = (
  ngay_cong_chieu: Date,
  ngay_ket_thuc?: Date,
): IMovieStatus => {
  const today = new Date();

  const start = new Date(ngay_cong_chieu);
  const end = ngay_ket_thuc ? new Date(ngay_ket_thuc) : null;

  // reset giờ về 00:00 để tránh lệch timezone
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end?.setHours(0, 0, 0, 0);

  if (today < start) return "sap_chieu";
  if (end && today > end) return "ngung_chieu";

  return "dang_chieu";
};

export const MOVIE_BADGE: Record<
  IMovieStatus,
  { text: string; color: string }
> = {
  dang_chieu: {
    text: "Đang Chiếu",
    color: "bg-green-500",
  },
  sap_chieu: {
    text: "Sắp Chiếu",
    color: "bg-yellow-500",
  },
  ngung_chieu: {
    text: "Ended",
    color: "bg-gray-500",
  },
};
