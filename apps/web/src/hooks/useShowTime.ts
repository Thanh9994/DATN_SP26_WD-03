import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';
import { API } from '@web/api/api.service';
import { ICreateShowTimePl, ShowTime, IShowTime } from '@shared/schemas';

export const useShowTime = (movieId?: string) => {
  const queryClient = useQueryClient();

  const { data: showtimes = [], isLoading } = useQuery<IShowTime[]>({
    queryKey: ['showtimes', 'movie', movieId],
    queryFn: async () => {
      if (!movieId) return [];
      const { data } = await axios.get(`${API.SHOWTIME}/movie/${movieId}`, {
        params: { includePast: true },
      });
      // console.log("Dữ liệu lịch chiếu trả về:", data.data);
      return data.data;
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5, //tươi 5 phút
    refetchOnWindowFocus: false, // tắt chuyển tab call lại api
  });

  const { mutate: createShowTime, isPending: isCreating } = useMutation({
    mutationFn: async (payload: ICreateShowTimePl) => {
      const validatedData = ShowTime.parse(payload);
      const { data } = await axios.post(API.SHOWTIME, validatedData);
      return data;
    },
    onSuccess: () => {
      message.success('Tạo suất chiếu thành công!');
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-showtimes'] });
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      const overlap = error.response?.data?.overlappingWith;

      if (overlap) {
        // 2. Nếu có thông tin trùng lịch, hiển thị chi tiết giờ trùng
        const start = dayjs(overlap.start).format('HH:mm');
        const end = dayjs(overlap.end).format('HH:mm');
        message.error(`${serverMessage} (Trùng từ ${start} - ${end})`, 4);
      } else {
        message.error(serverMessage || 'Lỗi tạo suất chiếu');
      }
    },
  });

  const { mutate: deleteShowTime, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`${API.SHOWTIME}/${id}`);
      return data;
    },
    onSuccess: () => {
      message.success('Đã xóa suất chiếu');
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-showtimes'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Không thể xóa');
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

export const useDashboardShowTimes = (date: string) => {
  return useQuery({
    queryKey: ['dashboard-showtimes', date],
    queryFn: async () => {
      const { data } = await axios.get(`${API.SHOWTIME}`, {
        params: { date },
      });
      return data.data;
    },
    enabled: !!date,
    staleTime: 1000 * 60 * 10,
  });
};

export const useShowTimeCountByMonth = (month?: number, year?: number) => {
  return useQuery({
    queryKey: ['dashboard-showtimes-count', 'month', month, year],
    queryFn: async () => {
      if (!month || !year) return 0;
      const { data } = await axios.get(`${API.SHOWTIME}`, {
        params: { month, year },
      });
      return data.data?.length ?? 0;
    },
    enabled: !!month && !!year,
    staleTime: 1000 * 60 * 10,
  });
};

export const useShowTimeCountByYear = (year?: number) => {
  return useQuery({
    queryKey: ['dashboard-showtimes-count', 'year', year],
    queryFn: async () => {
      if (!year) return 0;
      const { data } = await axios.get(`${API.SHOWTIME}`, {
        params: { year },
      });
      return data.data?.length ?? 0;
    },
    enabled: !!year,
    staleTime: 1000 * 60 * 10,
  });
};

export const useShowTimesByMovie = (movieId?: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['movie-showtimes', movieId],
    queryFn: async () => {
      if (!movieId) return null;
      const { data } = await axios.get(`${API.SHOWTIME}/movie/${movieId}`);
      return data.data; // showtimes từ backend
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5, // dữ liệu tươi 5 phút
    refetchOnWindowFocus: false,
  });

  const groupedByCinema = data?.reduce((acc: any, st: any) => {
    const cinema = st.roomId?.cinema_id;
    const cinemaId = cinema?._id;

    if (!cinemaId) return acc;

    if (!acc[cinemaId]) {
      acc[cinemaId] = {
        cinemaInfo: cinema,
        showtimes: [],
      };
    }

    acc[cinemaId].showtimes.push(st);
    return acc;
  }, {});

  return {
    showtimes: data || [],
    groupedByCinema: groupedByCinema ? Object.values(groupedByCinema) : [],
    isLoading,
    isError,
    refetch,
  };
};
