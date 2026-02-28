import { ICinema, ICreateCinema, IPhong, IPhongCreate } from "@shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
const API_URL_CINEMAS = "http://localhost:5000/api/cinemas";
const API_URL_ROOMS = "http://localhost:5000/api/rooms";

export const useCinemas = () => {
  const queryClient = useQueryClient();

  const { data: cinemas, isLoading } = useQuery<ICinema[]>({
    queryKey: ["cinemas"],
    queryFn: async () => {
      const { data } = await axios.get(API_URL_CINEMAS);
      return data.data;
    },
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });

  const createCinema = useMutation({
    mutationFn: (newCinema: ICreateCinema) =>
      axios.post(API_URL_CINEMAS, newCinema),
    onSuccess: () => {
      message.success("Thêm rạp thành công!");
      queryClient.invalidateQueries({ queryKey: ["cinemas"] });
    },
    onError: () => message.error("Lỗi khi thêm rạp"),
  });

  const updateCinema = useMutation({
    mutationFn: async ({
      id,
      cinema,
    }: {
      id: string;
      cinema: ICreateCinema;
    }) => {
      const { data } = await axios.put(`${API_URL_CINEMAS}/${id}`, cinema);
      return data;
    },
    onSuccess: () => {
      message.success("Cập nhật rạp thành công");
      queryClient.invalidateQueries({ queryKey: ["cinemas"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`${API_URL_CINEMAS}/${id}`),
    onSuccess: () => {
      message.success("Đã xóa rạp");
      queryClient.invalidateQueries({ queryKey: ["cinemas"] });
    },
  });
  return {
    cinemas,
    isLoading,
    createCinema: createCinema.mutateAsync,
    updateCinema: updateCinema.mutateAsync,
    deleteCinema: deleteMutation.mutate,
    isProcessing: createCinema.isPending || updateCinema.isPending,
  };
};

export const useMovie = (id: string) => {
  return useQuery<ICinema>({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL_CINEMAS}/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
};

export const useRooms = () => {
  const queryClient = useQueryClient();
  const {
    data: rooms,
    isLoading,
    isError,
  } = useQuery<IPhong[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const data = await axios.get(API_URL_ROOMS);
      return data.data;
    },
  });

  const createRoom = useMutation({
    mutationFn: (newRoom: IPhongCreate) => axios.post(API_URL_ROOMS, newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] }); // Load lại danh sách khi thêm xong
    },
  });

  const deleteRoom = useMutation({
    mutationFn: (id: string) => axios.delete(`${API_URL_ROOMS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return {
    rooms,
    isLoading,
    isError,
    createRoom: createRoom.mutateAsync,
    deleteRoom: deleteRoom.mutate,
    isCreating: createRoom.isPending,
    isDeleting: deleteRoom.isPending,
  }
};
