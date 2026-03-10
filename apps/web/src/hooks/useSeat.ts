import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { message } from "antd";
import { API } from "@web/api/api.service";
import { IShowTimeSeat } from "@shared/schemas";

export const useSeatsByShowtime = (showtimeId?: string) => {
  return useQuery<IShowTimeSeat[]>({
    queryKey: ["seats", showtimeId],
    queryFn: async () => {
      if (!showtimeId) return [];
      const { data } = await axios.get(`${API.SHOWTIME}/${showtimeId}/seats`);
      return data.data;
    },
    enabled: !!showtimeId,
    staleTime: 1000 * 30, // Cache 30s
  });
};

export const useSeatStats = (showtimeId?: string) => {
  return useQuery({
    queryKey: ["seat-stats", showtimeId],
    queryFn: async () => {
      if (!showtimeId) return null;
      const { data } = await axios.get(`${API.SHOWTIME}/${showtimeId}/seat-stats`);
      return data.data;
    },
    enabled: !!showtimeId,
    staleTime: 1000 * 30,
  });
};

export const useHoldSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      showtimeId,
      seatIds,
    }: {
      showtimeId: string;
      seatIds: string[];
    }) => {
      const { data } = await axios.post(`${API.SHOWTIME}/${showtimeId}/hold-seats`, {
        seatIds,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seats", variables.showtimeId] });
      queryClient.invalidateQueries({ queryKey: ["seat-stats", variables.showtimeId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Không thể giữ ghế");
    },
  });
};

export const useReleaseSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      showtimeId,
      seatIds,
    }: {
      showtimeId: string;
      seatIds: string[];
    }) => {
      const { data } = await axios.post(`${API.SHOWTIME}/${showtimeId}/release-seats`, {
        seatIds,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seats", variables.showtimeId] });
      queryClient.invalidateQueries({ queryKey: ["seat-stats", variables.showtimeId] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Không thể hủy giữ ghế");
    },
  });
};

export const useCalculateSeatStats = (seats?: IShowTimeSeat[], totalSeats?: number) => {
  if (!seats || !totalSeats) {
    return { totalSeats: 0, bookedSeats: 0, heldSeats: 0, availableSeats: 0 };
  }

  const bookedSeats = seats.filter((s) => s.trang_thai === "booked").length;
  const heldSeats = seats.filter((s) => s.trang_thai === "hold").length;
  const availableSeats = totalSeats - bookedSeats - heldSeats;

  return { totalSeats, bookedSeats, heldSeats, availableSeats };
};
