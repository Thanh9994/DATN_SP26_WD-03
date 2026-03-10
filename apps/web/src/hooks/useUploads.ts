import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ICloudinaryImage, IUploadParams } from "@shared/schemas";
import { API } from "@web/api/api.service";

export const useUpload = () => {
  const queryClient = useQueryClient();

  const {
    data: images,
    isLoading,
    isError,
    refetch,
  } = useQuery<ICloudinaryImage[]>({
    queryKey: ["images"],
    queryFn: async () => {
      const { data } = await axios.get(API.UPLOADS);
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
      const { data } = await axios.post(API.UPLOADS, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (public_Id: string) => {
      // Encode publicId vì nó có thể chứa dấu '/' (ví dụ: cinema_app/abc)
      await axios.delete(`${API.UPLOADS}/${encodeURIComponent(public_Id)}`);
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
