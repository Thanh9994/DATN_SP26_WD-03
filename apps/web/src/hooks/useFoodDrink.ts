import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { axiosAuth } from "./useAuth";
import { message } from "antd";

export interface IFoodDrink {
  _id: string;
  ten_mon: string;
  slug: string;
  mo_ta?: string;
  loai: "food" | "drink" | "combo";
  gia_ban: number;
  gia_goc?: number;
  hinh_anh?: string;
  badge?: string;
  la_noi_bat?: boolean;
  kha_dung?: boolean;
  so_luong_ton?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateFoodDrinkPayload {
  ten_mon: string;
  slug: string;
  mo_ta?: string;
  loai: "food" | "drink" | "combo";
  gia_ban: number;
  gia_goc?: number;
  hinh_anh?: string;
  badge?: string;
  la_noi_bat?: boolean;
  kha_dung?: boolean;
  so_luong_ton?: number;
}

export interface IUpdateFoodDrinkPayload {
  ten_mon?: string;
  slug?: string;
  mo_ta?: string;
  loai?: "food" | "drink" | "combo";
  gia_ban?: number;
  gia_goc?: number;
  hinh_anh?: string;
  badge?: string;
  la_noi_bat?: boolean;
  kha_dung?: boolean;
  so_luong_ton?: number;
}

export const useFoodDrink = (id?: string) => {
  const queryClient = useQueryClient();

  const {
    data: foodDrinks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<IFoodDrink[]>({
    queryKey: ["foodsdrink"],
    queryFn: async () => {
      const res = await axiosAuth.get(API.FOODDRINK);
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    },
  });

  const {
    data: foodDrinkDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery<IFoodDrink | null>({
    queryKey: ["foodsdrink-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosAuth.get(`${API.FOODDRINK}/${id}`);
      return res.data?.data || res.data;
    },
    enabled: !!id,
  });

  const createFoodDrinkMutation = useMutation({
    mutationFn: async (payload: ICreateFoodDrinkPayload) => {
      const { data } = await axiosAuth.post(API.FOODDRINK, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["foodsdrink"],
      });
      message.success("Thêm món thành công");
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Thêm món thất bại");
    },
  });

  const updateFoodDrinkMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateFoodDrinkPayload;
    }) => {
      const { data } = await axiosAuth.patch(`${API.FOODDRINK}/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["foodsdrink"],
      });
      queryClient.invalidateQueries({
        queryKey: ["foodsdrink-detail", variables.id],
      });
      message.success("Cập nhật món thành công");
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Cập nhật món thất bại");
    },
  });

  const deleteFoodDrinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosAuth.delete(`${API.FOODDRINK}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["foodsdrink"],
      });
      message.success("Xóa món thành công");
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Xóa món thất bại");
    },
  });

  return {
    foodDrinks,
    foodDrinkDetail,

    isLoading,
    isError,
    isDetailLoading,
    isDetailError,

    refreshFoodDrink: refetch,

    createFoodDrink: createFoodDrinkMutation.mutateAsync,
    isCreating: createFoodDrinkMutation.isPending,

    updateFoodDrink: updateFoodDrinkMutation.mutateAsync,
    isUpdating: updateFoodDrinkMutation.isPending,

    deleteFoodDrink: deleteFoodDrinkMutation.mutateAsync,
    isDeleting: deleteFoodDrinkMutation.isPending,
  };
};