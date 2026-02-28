import { API } from "@web/api/api.service";
import { ICinema, ICreateCinema, IPhong, IPhongCreate } from "@shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

export const useCinemas = () => {
  const queryClient = useQueryClient();

  const { data: cinemas, isLoading } = useQuery<ICinema[]>({
    queryKey: ["cinemas"],
    queryFn: async () => {
      const { data } = await axios.get(API.CINEMAS);
      return data.data;
    },
    staleTime: 1000 * 60 * 15, // 15p gọi lại dữ liệu từ api
    gcTime: 1000 * 60 * 60, // 60p xóa dữ liệu khỏi cache làm mới lại
  });

  const createCinema = useMutation({
    mutationFn: (newCinema: ICreateCinema) =>
      axios.post(API.CINEMAS, newCinema),
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
      const { data } = await axios.put(`${API.CINEMAS}/${id}`, cinema);
      return data;
    },
    onSuccess: () => {
      message.success("Cập nhật rạp thành công");
      queryClient.invalidateQueries({ queryKey: ["cinemas"] });
    },
  });

  const addRoomsToCinema = useMutation({
    mutationFn: async ({
      cinemaId,
      phongIds,
    }: {
      cinemaId: string;
      phongIds: string[];
    }) => {
      const { data } = await axios.patch(
        `${API.CINEMAS}/${cinemaId}/add-rooms`,
        { phongIds },
      );
      return data;
    },
    onSuccess: () => {
      message.success("Thêm phòng vào rạp thành công!");
      queryClient.invalidateQueries({ queryKey: ["cinemas"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () => {
      message.error("Thêm phòng thất bại!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`${API.CINEMAS}/${id}`),
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
    addRoomsToCinema: addRoomsToCinema.mutateAsync,
    isProcessing: createCinema.isPending || updateCinema.isPending,
    isAddingRooms: addRoomsToCinema.isPending,
  };
};

export const useMovie = (id: string) => {
  return useQuery<ICinema>({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API.CINEMAS}/${id}`);
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
      const data = await axios.get(API.ROOMS);
      return data.data;
    },
  });

  const createRoom = useMutation({
    mutationFn: (newRoom: IPhongCreate) => axios.post(API.ROOMS, newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] }); // Load lại danh sách khi thêm xong
    },
  });

  const deleteRoom = useMutation({
    mutationFn: (id: string) => axios.delete(`${API.ROOMS}/${id}`),
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
  };
};
