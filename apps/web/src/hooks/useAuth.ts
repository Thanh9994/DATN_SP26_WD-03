import {
  IUser,
  ILoginPayload,
  IRegisterPayload,
  IAuthResponse,
  IUpdateUser,
} from "@shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Axios instance có gắn token
export const axiosAuth = axios.create();

axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await axiosAuth.get<IUser>(`${API_URL}/me`);
      return data;
    },
    enabled: !!localStorage.getItem("token"),
  });

  const loginMutation = useMutation<IAuthResponse, Error, ILoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post<IAuthResponse>(
        `${API_URL}/login`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      message.success("Đăng nhập thành công");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      message.error(err.message || "Đăng nhập thất bại");
    },
  });

  const registerMutation = useMutation<any, Error, IRegisterPayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(`${API_URL}/register`, payload);
      return data;
    },
    onSuccess: () => {
      message.success("Đăng ký thành công");
    },
    onError: (err) => {
      message.error(err.message || "Đăng ký thất bại");
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.removeQueries({ queryKey: ["me"] });
    message.success("Đã đăng xuất");
  };

  const { data: users, isLoading: isLoadingUsers } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosAuth.get(`${API_URL}/`);
      return data;
    },
    enabled: !!localStorage.getItem("token") && user?.role === "admin",
  });
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      datas,
    }: {
      id: string;
      datas: Partial<IUpdateUser>;
    }) => {
      const { data } = await axiosAuth.patch(`${API_URL}/${id}`, datas);
      return data;
    },
    onSuccess: () => {
      message.success("Cập nhật người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      message.error(err.message || "Cập nhật thất bại");
    },

  });
  return {
    user,
    users,
    isLoading,
    isLoadingUsers,
    isError,
    updateMutation: updateMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  };
};
