import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';
import { API } from '@web/api/api.service';
import { ICreateShowTimePl, IMovie, IPhong, IShowTime, IShowTimeStatus, ShowTime } from '@shared/schemas';

type PopulatedCinema = {
  _id?: string;
  name?: string;
  city?: string;
  address?: string;
};

type ApiError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
      overlappingWith?: {
        start: string | Date;
        end: string | Date;
      };
    };
  };
};

export type AdminShowtimeSeatInfo = {
  total: number;
  booked: number;
  held?: number;
  available: number;
};

export type AdminShowtimeRow = IShowTime & {
  _id?: string;
  movieId: string | Pick<IMovie, '_id' | 'ten_phim' | 'thoi_luong' | 'ngay_cong_chieu' | 'ngay_ket_thuc'>;
  roomId:
    | string
    | (IPhong & {
        cinema_id: string | PopulatedCinema;
      });
  status: IShowTimeStatus;
  display?: {
    label: string;
    color: string;
  };
  seatInfo?: AdminShowtimeSeatInfo;
  canDelete?: boolean;
};

export const useShowTime = (movieId?: string) => {
  const queryClient = useQueryClient();

  const { data: showtimes = [], isLoading } = useQuery<AdminShowtimeRow[]>({
    queryKey: ['showtimes', 'movie', movieId],
    queryFn: async () => {
      const { data } = movieId
        ? await axios.get(`${API.SHOWTIME}/movie/${movieId}`, {
            params: { includePast: true },
          })
        : await axios.get(API.SHOWTIME);
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: ICreateShowTimePl) => {
      const validatedData = ShowTime.parse(payload);
      const { data } = await axios.post(API.SHOWTIME, validatedData);
      return data;
    },
    onSuccess: () => {
      message.success('Tao suat chieu thanh cong!');
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-showtimes'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
    onError: (error: ApiError) => {
      const serverMessage = error.response?.data?.message;
      const overlap = error.response?.data?.overlappingWith;

      if (overlap) {
        const start = dayjs(overlap.start).format('HH:mm');
        const end = dayjs(overlap.end).format('HH:mm');
        message.error(`${serverMessage} (Trung tu ${start} - ${end})`, 4);
      } else {
        message.error(serverMessage || 'Loi tao suat chieu');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`${API.SHOWTIME}/${id}`);
      return data;
    },
    onSuccess: () => {
      message.success('Da xoa suat chieu');
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-showtimes'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
    onError: (error: ApiError) => {
      message.error(error.message || 'Khong the xoa');
    },
  });

  return {
    showtimes,
    isLoading,
    createShowTime: createMutation.mutate,
    createShowTimeAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteShowTime: deleteMutation.mutate,
    deleteShowTimeAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
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
  const { data, isLoading, isError, refetch } = useQuery<AdminShowtimeRow[] | null>({
    queryKey: ['movie-showtimes', movieId],
    queryFn: async () => {
      if (!movieId) return null;
      const { data } = await axios.get(`${API.SHOWTIME}/movie/${movieId}`);
      return data.data;
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const groupedByCinema = data?.reduce<Record<string, { cinemaInfo: PopulatedCinema; showtimes: AdminShowtimeRow[] }>>(
    (acc, showtime) => {
      const cinema = typeof showtime.roomId === 'object' ? showtime.roomId.cinema_id : undefined;
      const cinemaId = typeof cinema === 'object' ? cinema?._id : undefined;

      if (!cinemaId || typeof cinema !== 'object') return acc;

      if (!acc[cinemaId]) {
        acc[cinemaId] = {
          cinemaInfo: cinema,
          showtimes: [],
        };
      }

      acc[cinemaId].showtimes.push(showtime);
      return acc;
    },
    {},
  );

  return {
    showtimes: data || [],
    groupedByCinema: groupedByCinema ? Object.values(groupedByCinema) : [],
    isLoading,
    isError,
    refetch,
  };
};
