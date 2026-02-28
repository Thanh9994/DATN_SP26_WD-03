import { IGenre } from "@shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { message } from "antd";
import axios from "axios";

export const useGenres = () => {
  const queryClient = useQueryClient();

  const {
    data: genres,
    isLoading,
    isError,
  } = useQuery<IGenre[]>({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data } = await axios.get(API.GENRES);
      return data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const { mutate: addGenre, isPending: isAdding } = useMutation({
    mutationFn: async (genre: IGenre) => {
      const { data } = await axios.post(API.GENRES, genre);
      return data;
    },
    onSuccess: () => {
      message.success("Thêm thể loại thành công");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });

  const { mutate: updateGenre, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, genre }: { id: string; genre: IGenre }) => {
      const { data } = await axios.put(`${API.GENRES}/${id}`, genre);
      return data;
    },
    onSuccess: () => {
      message.success("Cập nhật thể loại thành công");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });

  const { mutate: deleteGenre, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API.GENRES}/${id}`);
    },
    onSuccess: () => {
      message.success("Xóa thể loại thành công");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });

  return {
    genres,
    isLoading,
    isError,
    addGenre,
    isAdding,
    updateGenre,
    isUpdating,
    deleteGenre,
    isDeleting,
  };
};
