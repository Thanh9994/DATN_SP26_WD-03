import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API } from '@web/api/api.service';

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

export const useStaffCheckin = () => {
  const { mutateAsync: checkinTicket, isPending: isCheckingInTicket } = useMutation({
    mutationFn: async ({ ticketCode }: { ticketCode: string }) => {
      const { data } = await axios.patch(API.CHECKIN_TICKET_WARNING, { ticketCode });
      return data.data as IStaffCheckinResponse;
    },
  });

  return {
    checkinTicket,
    isCheckingInTicket,
  };
};

export const useStaffShowtimeAlerts = () => {
  return useQuery<IStaffShowtimeAlert[]>({
    queryKey: ['staff-showtime-alerts'],
    queryFn: async () => {
      const { data } = await axios.get(API.STAFF_SHOWTIME_ALERTS);
      return data?.data || [];
    },
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
};