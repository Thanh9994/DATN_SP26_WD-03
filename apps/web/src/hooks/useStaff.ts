import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API } from '@web/api/api.service';
import { axiosAuth } from './useAuth';

export interface IStaffCheckinResponse {
  success: boolean;
  message: string;
  status?: string;
  ticketCode?: string;
  pickedUpAt?: string;
  isLateCheckin?: boolean;
  lateMinutes?: number;
  warningMessage?: string | null;
  movieName?: string;
  roomName?: string;
  cinemaName?: string;
  startTime?: string | null;
}

export interface IStaffShowtimeAlert {
  showTimeId: string;
  movieName: string;
  roomName: string;
  cinemaName: string;
  startTime: string;
  diffMinutes: number;
  type: 'sap_bat_dau' | 'da_bat_dau';
  message: string;
}

export interface IStaffDashboardOverview {
  todayPaidTickets: number;
  todayCheckedInTickets: number;
  upcomingShowtimes: number;
  todayLateCheckins: number;
}

export interface IStaffUpcomingShow {
  _id: string;
  movieName: string;
  roomName: string;
  cinemaName: string;
  startTime: string;
  diffMinutes: number;
}

export interface IStaffRecentCheckin {
  _id: string;
  ticketCode?: string;
  pickedUpAt?: string;
  movieName: string;
  roomName: string;
  cinemaName: string;
  isLateCheckin: boolean;
  lateMinutes: number;
}

export const useStaff = () => {
  const queryClient = useQueryClient();

  const checkinTicket = useMutation({
    mutationFn: async ({ ticketCode }: { ticketCode: string }) => {
      const res = await axiosAuth.patch(API.CHECKIN_TICKET_WARNING, {
        ticketCode,
      });
      return res.data.data as IStaffCheckinResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['showtime-detail'] });
      queryClient.invalidateQueries({ queryKey: ['staff-showtime-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['staff-dashboard-overview'] });
      queryClient.invalidateQueries({ queryKey: ['staff-dashboard-recent-checkins'] });
    },
  });

  const {
    data: showtimeAlerts = [],
    isLoading: isLoadingShowtimeAlerts,
    isError: isShowtimeAlertsError,
    refetch: refetchShowtimeAlerts,
  } = useQuery<IStaffShowtimeAlert[]>({
    queryKey: ['staff-showtime-alerts'],
    queryFn: async () => {
      const res = await axiosAuth.get(API.STAFF_SHOWTIME_ALERTS);
      return res.data?.data || [];
    },
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const {
    data: dashboardOverview,
    isLoading: isLoadingDashboardOverview,
    isError: isDashboardOverviewError,
    refetch: refetchDashboardOverview,
  } = useQuery<IStaffDashboardOverview>({
    queryKey: ['staff-dashboard-overview'],
    queryFn: async () => {
      const res = await axiosAuth.get(API.STAFF_DASHBOARD_OVERVIEW);
      return res.data?.data;
    },
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const {
    data: upcomingShows = [],
    isLoading: isLoadingUpcomingShows,
    isError: isUpcomingShowsError,
    refetch: refetchUpcomingShows,
  } = useQuery<IStaffUpcomingShow[]>({
    queryKey: ['staff-dashboard-upcoming-shows'],
    queryFn: async () => {
      const res = await axiosAuth.get(API.STAFF_DASHBOARD_UPCOMING_SHOWS);
      return res.data?.data || [];
    },
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const {
    data: recentCheckins = [],
    isLoading: isLoadingRecentCheckins,
    isError: isRecentCheckinsError,
    refetch: refetchRecentCheckins,
  } = useQuery<IStaffRecentCheckin[]>({
    queryKey: ['staff-dashboard-recent-checkins'],
    queryFn: async () => {
      const res = await axiosAuth.get(API.STAFF_DASHBOARD_RECENT_CHECKINS);
      return res.data?.data || [];
    },
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    checkinTicket: checkinTicket.mutateAsync,
    isCheckingInTicket: checkinTicket.isPending,

    showtimeAlerts,
    isLoadingShowtimeAlerts,
    isShowtimeAlertsError,
    refetchShowtimeAlerts,

    dashboardOverview,
    isLoadingDashboardOverview,
    isDashboardOverviewError,
    refetchDashboardOverview,

    upcomingShows,
    isLoadingUpcomingShows,
    isUpcomingShowsError,
    refetchUpcomingShows,

    recentCheckins,
    isLoadingRecentCheckins,
    isRecentCheckinsError,
    refetchRecentCheckins,
  };
};