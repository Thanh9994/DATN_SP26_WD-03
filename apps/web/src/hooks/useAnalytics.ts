import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type AnalyticsResponse = {
  filters: {
    theaters: string[];
    statuses: string[];
  };
  summary: {
    totalRevenue: number;
    totalTicketsSold: number;
    totalMovies: number;
    totalUsers: number;
    totalShowtimes: number;
  };
  charts: {
    revenueTrend: Array<{
      label: string;
      revenue: number;
    }>;
    bookingStatus: Array<{
      _id: string;
      count: number;
    }>;
    topMovies: Array<{
      movieName: string;
      ticketsSold: number;
    }>;
    topTheaters: Array<{
      theaterName: string;
      revenue: number;
    }>;
  };
};

export type UseAnalyticsParams = {
  fromDate?: string;
  toDate?: string;
  theaterName?: string;
  status?: string;
};

const API_BASE_URL = "http://localhost:5000";

export const useAnalytics = (params: UseAnalyticsParams) => {
  return useQuery<AnalyticsResponse>({
    queryKey: ["analytics", params],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/analytics`, {
        params: {
          fromDate: params?.fromDate,
          toDate: params?.toDate,
          theaterName: params?.theaterName || "all",
          status: params?.status || "all",
        },
      });

      return res.data.data;
    },
  });
};