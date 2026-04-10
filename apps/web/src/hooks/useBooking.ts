import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@web/api/api.service';
import { axiosAuth } from './useAuth';

export const useBooking = (showTimeId?: string) => {
  const queryClient = useQueryClient();
  // const token = localStorage.getItem("accessToken");
  const {
    data: bookingData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['showtime-detail', showTimeId],
    queryFn: async () => {
      if (!showTimeId) return null;
      const res = await axiosAuth.get(`${API.SHOWTIME}/${showTimeId}`);
      return res.data;
    },
    enabled: !!showTimeId,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  const holdSeats = useMutation({
    mutationFn: async (payload: { showTimeId: string; seats: string[] }) => {
      const { data } = await axiosAuth.post(`${API.BOOKING}/hold`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['showtime-detail', showTimeId],
      });
    },
  });

  const createPaymentUrl = useMutation({
    mutationFn: async ({
      bookingId,
      holdToken,
      method,
    }: {
      bookingId: string;
      holdToken: string;
      method: string;
    }) => {
      const res = await axiosAuth.post(`${API.PAYMENT_GATEWAY}/${method}/create`, {
        bookingId,
        holdToken,
      });
      // console.log('PAYMENT RESPONSE', res.data.data);
      return res.data.data; // chỉ trả link
    },
  });

  const { data: pendingBooking } = useQuery({
    queryKey: ['pending-booking', showTimeId],
    queryFn: async () => {
      if (!showTimeId) return null;
      const res = await axiosAuth.get(`${API.BOOKING}/pending/${showTimeId}`);
      return res.data.data;
    },
    enabled: !!showTimeId,
    refetchOnWindowFocus: true,
  });

  const cancelBooking = useMutation({
    mutationFn: async ({ bookingId, holdToken }: { bookingId: string; holdToken: string }) => {
      const res = await axiosAuth.post(`${API.BOOKING}/cancel`, {
        bookingId,
        holdToken,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['showtime-detail', showTimeId],
      });
      queryClient.invalidateQueries({
        queryKey: ['pending-booking', showTimeId],
      });
    },
  });

  const expireBooking = useMutation({
    mutationFn: async ({ bookingId, holdToken }: { bookingId: string; holdToken: string }) => {
      const res = await axiosAuth.post(`${API.BOOKING}/expire`, {
        bookingId,
        holdToken,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['showtime-detail', showTimeId],
      });
      queryClient.invalidateQueries({
        queryKey: ['pending-booking', showTimeId],
      });
    },
  });

  const checkinTicket = useMutation({
    mutationFn: async ({ ticketCode }: { ticketCode: string }) => {
      const res = await axiosAuth.patch(`${API.BOOKING}/checkin-ticket`, {
        ticketCode,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['showtime-detail'] });
    },
  });

  return {
    pendingBooking,
    showTime: bookingData?.showTime,
    seats: bookingData?.seats || [],
    isLoading,
    isError,

    holdSeats: holdSeats.mutateAsync,
    isHolding: holdSeats.isPending,

    createPaymentUrl: createPaymentUrl.mutateAsync,
    isCreatingPayment: createPaymentUrl.isPending,

    cancelBooking: cancelBooking.mutateAsync,
    isCancelling: cancelBooking.isPending,

    expireBooking: expireBooking.mutateAsync,
    isExpiring: expireBooking.isPending,

    checkinTicket: checkinTicket.mutateAsync,
    isCheckingInTicket: checkinTicket.isPending,

    refreshSeats: refetch,
  };
};

export const useMyBookings = (status: string = 'paid') => {
  return useQuery({
    queryKey: ['my-bookings', status],
    queryFn: async () => {
      const res = await axiosAuth.get(`${API.BOOKING}/my`, {
        params: { status },
      });
      return res.data.data || [];
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
};
// ================= ADMIN TICKET =================

export const useAdminTickets = ({
  keyword = '',
  status = '',
  cinemaId = '',
  date = '',
  page = 1,
  limit = 10,
}: {
  keyword?: string;
  status?: string;
  cinemaId?: string;
  date?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['admin-tickets', keyword, status, cinemaId, date, page, limit],
    queryFn: async () => {
      const res = await axiosAuth.get(`${API.TICKETS}/admin`, {
        params: {
          keyword: keyword || undefined,
          status: status || undefined,
          cinemaId: cinemaId || undefined,
          date: date || undefined,
          page,
          limit,
        },
      });

      return {
        tickets: res.data?.data || [],
        pagination: res.data?.pagination || {},
      };
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useAdminTicketDetail = (id?: string) => {
  return useQuery({
    queryKey: ['admin-ticket-detail', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosAuth.get(`${API.TICKETS}/admin/${id}`);
      return res.data?.data || null;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};