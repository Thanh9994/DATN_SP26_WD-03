import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { message } from "antd";
import { API } from "@web/api/api.service";

export const useShowTime = (movieId?: string) => {
  const queryClient = useQueryClient();

  const { data: showtimes = [], isLoading } = useQuery({
    queryKey: ["showtimes", movieId],
    queryFn: async () => {
      if (!movieId) return [];
      const { data } = await axios.get(`${API.SHOWTIME}/movie/${movieId}`);
      return data.data;
    },
    enabled: !!movieId,
  });

  const { mutate: createShowTime, isPending: isCreating } = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axios.post(API.SHOWTIME, payload);
      return data;
    },
    onSuccess: () => {
      message.success("Tạo suất chiếu thành công!");
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi tạo suất chiếu");
    },
  });

  const { mutate: deleteShowTime, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`${API.SHOWTIME}/${id}`);
      return data;
    },
    onSuccess: () => {
      message.success("Đã xóa suất chiếu");
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Không thể xóa");
    },
  });

  return {
    showtimes,
    isLoading,
    createShowTime,
    isCreating,
    deleteShowTime,
    isDeleting,
  };
};
