import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { axiosAuth } from "./useAuth";
import { message } from "antd";

export const useBooking = (showTimeId?: string) => {
  const queryClient = useQueryClient();

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
    refetchInterval: 30000,
  });

  const holdSeats = useMutation({
    mutationFn: async (payload: {
      showTimeId: string;
      seats: string[];
      userId: string;
    }) => {
      const { data } = await axiosAuth.post(`${API.BOOKING}/hold`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["showtime-detail", showTimeId],
      });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Giữ ghế thất bại");
    },
  });

  // 3. Mutation: Xác nhận đặt vé (Confirm)
  const confirmBooking = useMutation({
    mutationFn: async (payload: {
      showTimeId: string;
      seatCodes: string[];
      userId: string;
      paymentId?: string;
    }) => {
      const { data } = await axiosAuth.post(`${API.BOOKING}/confirm`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["showtime-detail", showTimeId],
      });
      message.success("Đặt vé thành công!");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xác nhận đặt vé");
    },
  });

  const createPaymentUrl = useMutation({
    mutationFn: async (payload: { bookingId: string; method: string }) => {
      const { data } = await axiosAuth.post(
        `${API.PAYMENT_GATEWAY}/${payload.method}/create`,
        { bookingId: payload.bookingId },
      );
      return data; // Trả về { success: true, data: "http://vnpay..." }
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Lỗi khởi tạo thanh toán.",
      );
    },
  });

  return {
    showTime: bookingData?.showTime,
    seats: bookingData?.seats || [],
    isLoading,
    isError,

    holdSeats: holdSeats.mutateAsync,
    isHolding: holdSeats.isPending,

    confirmBooking: confirmBooking.mutateAsync,
    isConfirming: confirmBooking.isPending,

    createPaymentUrl: createPaymentUrl.mutateAsync,
    isCreatingPayment: createPaymentUrl.isPending,

    refreshSeats: refetch,
  };
};
