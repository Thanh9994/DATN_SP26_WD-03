import { useEffect, useState } from 'react';
import axios from 'axios';

type OverviewSummary = {
  totalRevenue: number;
  totalTickets: number;
  totalBookings: number;
  avgRevenuePerBooking: number;
};

type RevenueByDateItem = {
  date: string;
  revenue: number;
  tickets: number;
  bookings: number;
};

type TopMovie = {
  movieName: string;
  revenue: number;
  tickets: number;
  bookings: number;
};

type TopCinema = {
  theaterName: string;
  revenue: number;
  tickets: number;
  bookings: number;
};

type OverviewData = {
  summary: OverviewSummary;
  charts: {
    revenueByDate: RevenueByDateItem[];
  };
  topMovies: TopMovie[];
  topCinemas: TopCinema[];
};

type UseAnalyticsOverviewParams = {
  startDate?: string;
  endDate?: string;
};

export const useAnalyticsOverview = ({
  startDate,
  endDate,
}: UseAnalyticsOverviewParams) => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get('/analytics/overview', {
        params: {
          startDate,
          endDate,
        },
      });

      setData(res.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi lấy dữ liệu overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchOverview,
  };
};