import { useCallback, useEffect, useState } from "react";
import { API } from "../../api/api.service";

export type CinemaDetailSummary = {
  totalRevenue?: number;
  totalTickets?: number;
  occupancyRate?: number;
  ticketsSoldToday?: number;
  totalBookingsToday?: number;
  topMovie?: {
    movieId?: string;
    movieName?: string;
    soldTickets?: number;
  } | null;
};

export type CinemaDetailInfo = {
  cinemaId?: string;
  cinemaName?: string;
  address?: string;
  city?: string;
};

export type CinemaHourlyTrafficItem = {
  hour: string;
  tickets: number;
};

export type CinemaRecentActivityItem = {
  _id: string;
  userName?: string;
  userEmail?: string;
  roomName?: string;
  ticketCount?: number;
  finalAmount?: number;
  status?: string;
  createdAt?: string;
};

export type CinemaHallPerformanceItem = {
  roomId: string;
  roomName?: string;
  roomType?: string;
  capacity?: number;
  soldTickets?: number;
  showTimeCount?: number;
  occupancyRate?: number;
  status?: string;
};

export type UseAnalyticsCinemaDetailData = {
  cinemaInfo: CinemaDetailInfo | null;
  summary: CinemaDetailSummary;
  hourlyTraffic: CinemaHourlyTrafficItem[];
  recentActivities: CinemaRecentActivityItem[];
  hallPerformance: CinemaHallPerformanceItem[];
};

const parseResponseSafely = async (response: Response) => {
  const rawText = await response.text();

  if (!rawText) return null;

  const trimmed = rawText.trim();

  if (trimmed.startsWith("<!doctype") || trimmed.startsWith("<html")) {
    throw new Error("API trả về HTML thay vì JSON. Kiểm tra lại backend hoặc URL.");
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error("Response không phải JSON hợp lệ.");
  }
};

export const useAnalyticsCinemaDetail = (cinemaId?: string) => {
  const [data, setData] = useState<UseAnalyticsCinemaDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchAnalyticsCinemaDetail = useCallback(async () => {
    if (!cinemaId) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API.ANALYTICS}/cinemas/overview?cinemaId=${cinemaId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await parseResponseSafely(response);

      if (!response.ok) {
        throw new Error(result?.message || "Lỗi tải chi tiết rạp");
      }

      setData(result?.data || null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch chi tiết rạp";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [cinemaId]);

  useEffect(() => {
    fetchAnalyticsCinemaDetail();
  }, [fetchAnalyticsCinemaDetail]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalyticsCinemaDetail,
  };
};

export default useAnalyticsCinemaDetail;