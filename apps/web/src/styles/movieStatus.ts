import  { IMovieStatus } from '@shared/schemas';

export const calcMovieStatus = (
  ngay_cong_chieu: Date,
  ngay_ket_thuc?: Date
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

export const MOVIE_BADGE: Record<IMovieStatus, { text: string; color: string }> = {
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