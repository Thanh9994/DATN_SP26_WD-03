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

export const useStaff = () => {
  const queryClient = useQueryClient();

  const checkinTicket = useMutation({
    mutationFn: async ({ ticketCode }: { ticketCode: string }) => {
      const res = await axiosAuth.patch(`${API.STAFF}/checkin-ticket-warning`, {
        ticketCode,
      });
      return res.data.data as IStaffCheckinResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['showtime-detail'] });
      queryClient.invalidateQueries({ queryKey: ['staff-showtime-alerts'] });
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
      const res = await axiosAuth.get(`${API.STAFF}/showtime-alerts`);
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
  };
};