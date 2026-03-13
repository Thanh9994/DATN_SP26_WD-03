import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { axiosAuth } from "./useAuth";

export const useBooking = (showTimeId?: string) => {
  const queryClient = useQueryClient();
  // const token = localStorage.getItem("accessToken");
  // 1. Lấy thông tin suất chiếu và sơ đồ ghế
  const {
    data: bookingData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["showtime-detail", showTimeId],
    queryFn: async () => {
      if (!showTimeId) return null;
      const res = await axiosAuth.get(`${API.SHOWTIME}/${showTimeId}`);
      return res.data;
    },
    enabled: !!showTimeId,
    staleTime: 5000,
    refetchInterval: false,
  });

  const holdSeats = useMutation({
    mutationFn: async (payload: { showTimeId: string; seats: string[] }) => {
      const { data } = await axiosAuth.post(`${API.BOOKING}/hold`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["showtime-detail", showTimeId],
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
      const res = await axiosAuth.post(
        `${API.PAYMENT_GATEWAY}/${method}/create`,
        {
          bookingId,
          holdToken,
        },
      );
      console.log("PAYMENT RESPONSE", res.data.data);
      return res.data.data; // chỉ trả link
    },
  });

  const { data: pendingBooking } = useQuery({
    queryKey: ["pending-booking", showTimeId],
    queryFn: async () => {
      if (!showTimeId) return null;
      const res = await axiosAuth.get(`${API.BOOKING}/pending/${showTimeId}`);
      return res.data.data;
    },
    enabled: !!showTimeId,
    refetchOnWindowFocus: true,
  });

  const cancelBooking = useMutation({
    mutationFn: async ({
      bookingId,
      holdToken,
    }: {
      bookingId: string;
      holdToken: string;
    }) => {
      const res = await axiosAuth.post(`${API.BOOKING}/cancel`, {
        bookingId,
        holdToken,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["showtime-detail", showTimeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pending-booking", showTimeId],
      });
    },
  });

  const expireBooking = useMutation({
    mutationFn: async ({
      bookingId,
      holdToken,
    }: {
      bookingId: string;
      holdToken: string;
    }) => {
      const res = await axiosAuth.post(`${API.BOOKING}/expire`, {
        bookingId,
        holdToken,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["showtime-detail", showTimeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pending-booking", showTimeId],
      });
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

    refreshSeats: refetch,
  };
};

export const useMyBookings = (status: string = "paid") => {
  return useQuery({
    queryKey: ["my-bookings", status],
    queryFn: async () => {
      const res = await axiosAuth.get(`${API.BOOKING}/my`, {
        params: { status },
      });
      return res.data.data || [];
    },
    staleTime: 1000 * 60,
  });
};
