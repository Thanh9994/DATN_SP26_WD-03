import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ICloudinaryImage, IUploadParams } from "@shared/schemas";

export const useUpload = () => {
  const queryClient = useQueryClient();
  const BASE_URL = "http://localhost:5000/api/uploads";

  const {
    data: images,
    isLoading,
    isError,
    refetch,
  } = useQuery<ICloudinaryImage[]>({
    queryKey: ["images"],
    queryFn: async () => {
      const { data } = await axios.get(BASE_URL);
      return data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const uploadMutation = useMutation<ICloudinaryImage, Error, IUploadParams>({
    mutationFn: async ({ file, customName }) => {
      const formData = new FormData();
      formData.append("customName", customName);
      formData.append("image", file);
      const { data } = await axios.post(BASE_URL, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (public_Id: string) => {
      // Encode publicId vì nó có thể chứa dấu '/' (ví dụ: cinema_app/abc)
      await axios.delete(`${BASE_URL}/${encodeURIComponent(public_Id)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  return {
    images,
    isLoading,
    isError,
    upload: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteImage: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    reloadImages: refetch,
  };
};
