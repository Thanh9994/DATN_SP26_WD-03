import { useCallback, useState } from "react";
import axios from "axios";
import { API } from "@web/api/api.service";

export type AnalyticsTicketParams = {
  fromDate?: string;
  toDate?: string;
  theaterName?: string;
  status?: string;
};

export type AnalyticsTicketData = {
  filters: {
    theaters: string[];
    statuses: string[];
  };
  summary: {
    totalRevenue: number;
    totalTicketsSold: number;
    averageOrderValue: number;
    avgTicketsPerBooking: number;
    conversionRate: number;
    pendingRate: number;
    cancelRate: number;
    totalComboRevenue: number;
    comboAttachRate: number;
    totalShowtimes: number;
  };
  charts: {
    revenueTrend: Array<{ label: string; revenue: number; ticketsSold: number }>;
    bookingStatus: Array<{ name: string; value: number }>;
    ticketByWeekday: Array<{ weekday: string; ticketsSold: number }>;
    topMovies: Array<{ movieName: string; ticketsSold: number; revenue: number; bookings: number }>;
    topTheaters: Array<{ theaterName: string; revenue: number; ticketsSold: number }>;
  };
  recentBookings: Array<{
    userName: string;
    movieName: string;
    theaterName: string;
    seatsCount: number;
    amount: number;
    status: string;
  }>;
  insights: {
    topCustomers: Array<{
      userName: string;
      totalBookings: number;
      totalTickets: number;
      totalRevenue: number;
    }>;
  };
};

export const useAnalyticsTicket = () => {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsTicketData | null>(null);

  const getAnalyticsTicket = useCallback(
    async (params?: AnalyticsTicketParams) => {
      try {
        setLoading(true);

        const res = await axios.get(`${API.ANALYTICS}/ticket/overview`, {
          params,
        });

        const data: AnalyticsTicketData = res.data?.data || res.data;

        setAnalyticsData(data);
        return data;
      } catch (error) {
        console.error("Analytics Ticket Error:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    analyticsData,
    getAnalyticsTicket,
  };
};