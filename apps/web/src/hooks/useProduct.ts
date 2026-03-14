import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { message } from "antd";
import { API } from "@web/api/api.service";

export interface IProduct {
  _id?: string;
  name: string;
  image: string;
  originalPrice: number;
  price: number;
  isActive: boolean;
  isCombo: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useProducts = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get(API.PRODUCTS);
      console.log("GET products response:", res.data);
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const products: IProduct[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const { mutateAsync: createProduct, isPending: isAdding } = useMutation({
    mutationFn: async (product: IProduct) => {
      const res = await axios.post(API.PRODUCTS, product);
      return res.data;
    },
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      console.error("createProduct error:", error);
      message.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Thêm sản phẩm thất bại"
      );
    },
  });

  const { mutateAsync: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      product,
    }: {
      id: string;
      product: IProduct;
    }) => {
      const res = await axios.put(`${API.PRODUCTS}/${id}`, product);
      return res.data;
    },
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      console.error("updateProduct error:", error);
      message.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Cập nhật sản phẩm thất bại"
      );
    },
  });

  const { mutateAsync: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${API.PRODUCTS}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      message.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      console.error("deleteProduct error:", error);
      message.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Xóa sản phẩm thất bại"
      );
    },
  });

  return {
    products,
    isLoading,
    isError,
    error,
    createProduct,
    isAdding,
    updateProduct,
    isUpdating,
    deleteProduct,
    isDeleting,
  };
};

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`${API.PRODUCTS}/${id}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
};