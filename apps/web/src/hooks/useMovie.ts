import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ICreateMovie, IMovie, IUpdateMovie } from "@shared/schemas";
import { message } from "antd";
import { API } from "@web/api/api.service";

export const useMovies = () => {
  const queryClient = useQueryClient();

  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery<IMovie[]>({
    queryKey: ["movies"],
    queryFn: async () => {
      const { data } = await axios.get(API.MOVIES);
      return data.data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const { mutate: createMovie, isPending: isAdding } = useMutation({
    mutationFn: async (movie: ICreateMovie) => {
      const { data } = await axios.post(API.MOVIES, movie);
      return data;
    },
    onSuccess: () => {
      message.success("Thêm phim thành công");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: () => message.error("Thêm thất bại"),
  });

  const { mutate: updateMovie, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, movie }: { id: string; movie: IUpdateMovie }) => {
      const { data } = await axios.put(`${API.MOVIES}/${id}`, movie);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: () => message.error("Cập nhật thất bại"),
  });

  const { mutate: deleteMovie, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API.MOVIES}/${id}`);
    },
    onSuccess: () => {
      message.success("Xóa phim thành công");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: () => message.error("Xóa thất bại"),
  });

  return {
    movies,
    isLoading,
    isError,
    createMovie,
    isAdding,
    updateMovie,
    isUpdating,
    deleteMovie,
    isDeleting,
  };
};

export const useMovie = (id?: string) => {
  return useQuery<IMovie>({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API.MOVIES}/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
};
