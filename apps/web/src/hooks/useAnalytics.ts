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

export type BookingAnalyticsResponse = {
  filters: {
    theaters: string[];
    statuses: string[];
  };
  appliedFilters: {
    fromDate: string | null;
    toDate: string | null;
    theaterName: string;
    status: string;
  };
  overview: {
    totalRevenue: number;
    totalTickets: number;
    avgFillRate: number;
    avgRating: number;
    revenueGrowth: number;
    ticketsGrowth: number;
    fillRateGrowth: number;
    ratingGrowth: number;
  };
  revenueChart: Array<{
    label: string;
    revenue: number;
    tickets: number;
    bookings: number;
  }>;
  genreDistribution: Array<{
    name: string;
    value: number;
    tickets: number;
  }>;
  topCinemas: Array<{
    key: string;
    cinemaName: string;
    revenue: number;
    tickets: number;
    bookingCount: number;
    occupancyRate: number;
  }>;
  topMovies: Array<{
    key: string;
    movieName: string;
    releaseDate: string | null;
    tickets: number;
    revenue: number;
    bookingCount: number;
    genre: string;
    status: string;
  }>;
  highlights: {
    bestCinema: string | null;
    bestCinemaRevenue: number;
    bestMovie: string | null;
    bestMovieRevenue: number;
    bestDay: string | null;
    bestDayRevenue: number;
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

export const useBookingAnalytics = (params: UseAnalyticsParams) => {
  return useQuery<BookingAnalyticsResponse>({
    queryKey: ["booking-analytics", params],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/analytics/booking`, {
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