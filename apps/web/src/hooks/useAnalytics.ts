import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type AnalyticsResponse = {
  filters: {
    theaters: string[];
  };
  summary: {
    totalRevenue: number;
    totalPaidBookings: number;
    totalTicketsSold: number;
    totalMovies: number;
    totalUsers: number;
    totalShowtimes: number;
  };
  charts: {
    revenueTrend: Array<{
      label: string;
      year: number;
      month: number;
      revenue: number;
      bookings: number;
      tickets: number;
    }>;
    bookingStatus: Array<{
      status: string;
      count: number;
    }>;
    topMovies: Array<{
      movieName: string;
      revenue: number;
      bookings: number;
      ticketsSold: number;
    }>;
  };
};

export type UseAnalyticsParams = {
  fromDate?: string;
  toDate?: string;
  theaterName?: string;
};

const API_BASE_URL = "http://localhost:5000";

export const useAnalytics = (params: UseAnalyticsParams) => {
  return useQuery<AnalyticsResponse>({
    queryKey: ["analytics", params],
    retry: false,
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/analytics`, {
        params: {
          fromDate: params?.fromDate,
          toDate: params?.toDate,
          theaterName: params?.theaterName || "all",
        },
      });

      return res.data.data;
    },
  });
};