import { useCallback, useEffect, useState } from "react";
import { API } from "../../api/api.service";

export type CinemaAnalyticsItem = {
  cinemaId: string;
  cinemaName: string;
  city?: string;
  address?: string;
  totalRevenue?: number;
  totalTickets?: number;
  totalBookings?: number;
  roomCount?: number;
  occupancyRate?: number;
};

export type CinemaAnalyticsSummary = {
  totalCinemas?: number;
  totalRevenue?: number;
  totalTickets?: number;
  totalBookings?: number;
  totalRooms?: number;
  avgOccupancyRate?: number;
  topCinema?: {
    cinemaId?: string;
    cinemaName?: string;
    totalRevenue?: number;
  } | null;
};

export type UseAnalyticsCinemasData = {
  summary: CinemaAnalyticsSummary;
  items: CinemaAnalyticsItem[];
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

export const useAnalyticsCinemas = () => {
  const [data, setData] = useState<UseAnalyticsCinemasData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchAnalyticsCinemas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API.ANALYTICS}/cinemas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await parseResponseSafely(response);

      if (!response.ok) {
        throw new Error(result?.message || "Lỗi tải analytics nhiều rạp");
      }

      setData(result?.data || { summary: {}, items: [] });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch analytics nhiều rạp";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsCinemas();
  }, [fetchAnalyticsCinemas]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalyticsCinemas,
  };
};

export default useAnalyticsCinemas;