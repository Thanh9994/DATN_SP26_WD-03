import { IShowTime, IShowTimeStatus } from "@shared/schemas";

export const CalculateShowTimeStatus = (
  showTime: Partial<IShowTime>,
): IShowTimeStatus => {
  const now = new Date();
  const start = new Date(showTime.startTime!);
  const end = new Date(showTime.endTime!);

  // 1. Ưu tiên các trạng thái cố định được Admin hoặc hệ thống đánh dấu
  if (showTime.status === "cancelled" || showTime.status === "sold_out") {
    return showTime.status as IShowTimeStatus;
  }

  // 2. Tính toán theo mốc thời gian thực tế (Real-time)
  if (now < start) {
    return "upcoming";
  } else if (now >= start && now <= end) {
    return "ongoing";
  } else {
    return "finished";
  }
};

// Trả về cấu hình hiển thị (Màu sắc, Nhãn tiếng Việt) cho Frontend nếu cần
export const ShowTimeDisplay = (status: IShowTimeStatus) => {
  const configs: Record<IShowTimeStatus, { label: string; color: string }> = {
    upcoming: { label: "Sắp chiếu", color: "blue" },
    ongoing: { label: "Đang chiếu", color: "green" },
    finished: { label: "Đã kết thúc", color: "default" },
    sold_out: { label: "Hết ghế", color: "orange" },
    cancelled: { label: "Đã hủy", color: "red" },
  };
  return configs[status] || configs.upcoming;
};
