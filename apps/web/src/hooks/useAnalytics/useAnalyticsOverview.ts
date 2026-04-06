import { useCallback, useEffect, useMemo, useState } from 'react';
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

type SummaryCard = {
  key: string;
  label: string;
  value: string;
  rawValue: number;
};

const defaultOverviewData: OverviewData = {
  summary: {
    totalRevenue: 0,
    totalTickets: 0,
    totalBookings: 0,
    avgRevenuePerBooking: 0,
  },
  charts: {
    revenueByDate: [],
  },
  topMovies: [],
  topCinemas: [],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value || 0);

export const useAnalyticsOverview = ({
  startDate,
  endDate,
}: UseAnalyticsOverviewParams) => {
  const [data, setData] = useState<OverviewData>(defaultOverviewData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        'http://localhost:5000/api/analytics/overview',
        {
          params: {
            startDate,
            endDate,
          },
        },
      );

      console.log('Overview API response:', response.data);
      setData(response?.data?.data || defaultOverviewData);
    } catch (err: any) {
      console.error('Overview API error:', err?.response || err);
      setError(
        err?.response?.data?.message || 'Không thể tải dữ liệu tổng quan',
      );
      setData(defaultOverviewData);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const summaryCards = useMemo<SummaryCard[]>(() => {
    return [
      {
        key: 'revenue',
        label: 'Tổng doanh thu',
        value: formatCurrency(data.summary.totalRevenue),
        rawValue: data.summary.totalRevenue,
      },
      {
        key: 'tickets',
        label: 'Tổng vé đã bán',
        value: formatNumber(data.summary.totalTickets),
        rawValue: data.summary.totalTickets,
      },
      {
        key: 'bookings',
        label: 'Tổng đơn đặt vé',
        value: formatNumber(data.summary.totalBookings),
        rawValue: data.summary.totalBookings,
      },
      {
        key: 'avgRevenue',
        label: 'Doanh thu / đơn',
        value: formatCurrency(data.summary.avgRevenuePerBooking),
        rawValue: data.summary.avgRevenuePerBooking,
      },
    ];
  }, [data]);

  return {
    data,
    loading,
    error,
    refetch: fetchOverview,
    summaryCards,
    formatCurrency,
    formatNumber,
  };
};