import { API } from '@web/api/api.service';
import { ICinema, ICreateCinema, IPhong, IPhongCreate } from '@shared/src/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { axiosAuth } from './useAuth';

export const useCinemas = () => {
  const queryClient = useQueryClient();

  const { data: cinemas, isLoading } = useQuery<ICinema[]>({
    queryKey: ['cinemas'],
    queryFn: async () => {
      const { data } = await axiosAuth.get(API.CINEMAS);
      return data.data;
    },
    staleTime: 1000 * 60 * 15, // 15p gọi lại dữ liệu từ api
    gcTime: 1000 * 60 * 60, // 60p xóa dữ liệu khỏi cache làm mới lại
  });

  const createCinema = useMutation({
    mutationFn: (newCinema: ICreateCinema) => axiosAuth.post(API.CINEMAS, newCinema),
    onSuccess: () => {
      message.success('Thêm rạp thành công!');
      queryClient.invalidateQueries({ queryKey: ['cinemas'] });
    },
    onError: () => message.error('Lỗi khi thêm rạp'),
  });

  const updateCinema = useMutation({
    mutationFn: async ({ id, cinema }: { id: string; cinema: ICreateCinema }) => {
      const { data } = await axiosAuth.put(`${API.CINEMAS}/${id}`, cinema);
      return data;
    },
    onSuccess: () => {
      message.success('Cập nhật rạp thành công');
      queryClient.invalidateQueries({ queryKey: ['cinemas'] });
    },
  });

  const addRoomsToCinema = useMutation({
    mutationFn: async ({ cinemaId, phongIds }: { cinemaId: string; phongIds: string[] }) => {
      const { data } = await axiosAuth.patch(`${API.CINEMAS}/${cinemaId}/add-rooms`, { phongIds });
      return data;
    },
    onSuccess: () => {
      message.success('Thêm phòng vào rạp thành công!');
      queryClient.invalidateQueries({ queryKey: ['cinemas'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
    onError: () => {
      message.error('Thêm phòng thất bại!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosAuth.delete(`${API.CINEMAS}/${id}`),
    onSuccess: () => {
      message.success('Đã xóa rạp');
      queryClient.invalidateQueries({ queryKey: ['cinemas'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
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
    queryKey: ['movie', id],
    queryFn: async () => {
      const { data } = await axiosAuth.get(`${API.CINEMAS}/${id}`);
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
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data } = await axiosAuth.get(API.ROOMS);
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  const createRoom = useMutation({
    mutationFn: (newRoom: IPhongCreate) => axiosAuth.post(API.ROOMS, newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] }); // Load lại danh sách khi thêm xong
      queryClient.invalidateQueries({ queryKey: ['cinemas'] });
    },
  });

  const updateRoom = useMutation({
    mutationFn: async ({ id, room }: { id: string; room: any }) => {
      const { data } = await axiosAuth.put(`${API.ROOMS}/${id}`, room);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['cinemas'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật thất bại');
    },
  });

  const deleteRoom = useMutation({
    mutationFn: (id: string) => axiosAuth.delete(`${API.ROOMS}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['cinemas'] });
    },
  });

  return {
    rooms,
    isLoading,
    isError,
    createRoom: createRoom.mutateAsync,
    updateRoom: updateRoom.mutateAsync,
    deleteRoom: deleteRoom.mutate,
    isCreating: createRoom.isPending,
    isUpdating: updateRoom.isPending,
    isDeleting: deleteRoom.isPending,
  };
};
