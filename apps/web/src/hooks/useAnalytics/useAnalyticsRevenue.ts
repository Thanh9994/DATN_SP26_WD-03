import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API } from "../../api/api.service";

export type RevenueFilters = {
  fromDate?: string;
  toDate?: string;
  cinemaId?: string;
  theaterName?: string;
  paymentMethod?: string;
};

export type RevenueFilterOption = {
  cinemaId: string;
  cinemaName: string;
  city?: string;
  address?: string;
};

export type RevenueOverviewResponse = {
  filters: {
    cinemas: RevenueFilterOption[];
    paymentMethods: string[];
  };
  summary: {
    totalRevenue: number;
    totalTickets: number;
    totalBookings: number;
    avgOrderValue: number;
  };
  comparison: {
    revenue: {
      current: number;
      previous: number;
      growthPercent: number;
    };
    tickets: {
      current: number;
      previous: number;
      growthPercent: number;
    };
    bookings: {
      current: number;
      previous: number;
      growthPercent: number;
    };
    avgOrderValue: {
      current: number;
      previous: number;
      growthPercent: number;
    };
  };
  charts: {
    revenueTrend: Array<{
      date: string;
      revenue: number;
      tickets: number;
      bookings: number;
    }>;
    revenueByWeekday: Array<{
      weekday: string;
      revenue: number;
      tickets: number;
      bookings: number;
    }>;
    revenueByHour: Array<{
      hour: string;
      revenue: number;
      tickets: number;
      bookings: number;
    }>;
    paymentMethodStats: Array<{
      paymentMethod: string;
      revenue: number;
      bookings: number;
    }>;
  };
  ranking: {
    topCinemas: Array<{
      cinemaName: string;
      revenue: number;
      tickets: number;
      bookings: number;
    }>;
    topMovies: Array<{
      movieName: string;
      revenue: number;
      tickets: number;
      bookings: number;
    }>;
  };
  combos: {
    totalComboRevenue: number;
    bookingWithCombo: number;
    totalBookings: number;
    comboAttachRate: number;
  };
  recentHighValueOrders: Array<{
    movieName: string;
    cinemaName: string;
    amount: number;
    tickets: number;
    paymentMethod: string;
    createdAt: string;
  }>;
  insights: {
    bestRevenueDay: {
      date: string;
      revenue: number;
      bookings: number;
    } | null;
    peakHour: {
      hour: string;
      revenue: number;
      bookings: number;
    } | null;
    topCinema: {
      cinemaName: string;
      revenue: number;
      tickets: number;
      bookings: number;
    } | null;
    topMovie: {
      movieName: string;
      revenue: number;
      tickets: number;
      bookings: number;
    } | null;
  };
};

/**
 * Build query string from filters.
 * Ignore empty values and "all".
 */
const buildQueryString = (filters: RevenueFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all") {
      params.append(key, value);
    }
  });

  return params.toString();
};

export const useAnalyticsRevenue = (filters: RevenueFilters) => {
  const [data, setData] = useState<RevenueOverviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const queryString = useMemo(() => buildQueryString(filters), [filters]);

  const fetchRevenueAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const url = queryString
        ? `${API.ANALYTICS}/revenue?${queryString}`
        : `${API.ANALYTICS}/revenue`;

      const response = await axios.get(url);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Không thể tải analytics doanh thu");
      }

      setData(response.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra khi tải analytics doanh thu");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    fetchRevenueAnalytics();
  }, [fetchRevenueAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchRevenueAnalytics,
  };
};