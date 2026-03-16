import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API } from '@web/api/api.service';
import { axiosAuth } from '@web/hooks/useAuth';

export type IComment = {
  _id?: string;
  content: string;
  rating: number;
  ratting?: number;
  userId: { _id?: string; ho_ten?: string; avatar?: string } | string;
  movieId: string;
  createdAt?: string;
};

export const useMovieComments = (movieId?: string) => {
  return useQuery<IComment[]>({
    queryKey: ['comments', 'movie', movieId],
    queryFn: async () => {
      if (!movieId) return [];
      const { data } = await axiosAuth.get(`${API.COMMENTS}/movie/${movieId}`);
      const list = data?.data || [];
      return list.map((c: IComment) => ({
        ...c,
        rating: Number(c.rating ?? c.ratting ?? 0),
      }));
    },
    enabled: !!movieId,
    staleTime: 1000 * 30,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      content: string;
      rating: number;
      userId: string;
      movieId: string;
    }) => {
      const { data } = await axiosAuth.post(API.COMMENTS, payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', 'movie', variables.movieId],
      });
    },
  });
};
