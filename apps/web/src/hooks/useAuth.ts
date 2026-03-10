import {
  IUser,
  ILogin,
  IRegister,
  IAuthResponse,
  IUpdateUser,
} from "@shared/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { showNotify } from "@web/components/AppNotification";
import { message } from "antd";
import axios from "axios";

// Axios instance có gắn token
export const axiosAuth = axios.create();

axiosAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Lấy token tại thời điểm gửi request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await axiosAuth.get<IUser>(`${API.USERS}/me`);
      return data;
    },
    enabled: !!localStorage.getItem("token"),
    staleTime: Infinity, // Dữ liệu "me" không bao giờ cũ
    gcTime: 1000 * 60 * 60 * 2, // Giữ trong cache 24h
  });

  const loginMutation = useMutation<IAuthResponse, Error, ILogin>({
    mutationFn: async (payload) => {
      const { data } = await axios.post<IAuthResponse>(
        `${API.AUTH}/login`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showNotify("success", "Đăng Nhập Thành Công", "");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      showNotify("success", "Đăng nhập thất bại");
      console.error(err.message || "Đăng nhập thất bại");
    },
  });

  const registerMutation = useMutation<any, Error, IRegister>({
    mutationFn: async (payload) => {
      const { data } = await axios.post(`${API.AUTH}/register`, payload);
      return data;
    },
    onSuccess: () => {
      showNotify("success", "Đăng Ký Thành Công");
    },
    onError: (err) => {
      showNotify("success", "Đăng Ký thất bại");
      console.error(err.message || "Đăng ký thất bại");
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.removeQueries({ queryKey: ["me"] });
    showNotify("success", "Đăng Xuất Thành Công", "");
  };

  const { data: users, isLoading: isLoadingUsers } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosAuth.get(`${API.USERS}/`);
      return data;
    },
    enabled: !!localStorage.getItem("token") && user?.role === "admin", // Chỉ gọi khi có token và là admin
    staleTime: 1000 * 60 * 5,
  });
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      datas,
    }: {
      id: string;
      datas: Partial<IUpdateUser>;
    }) => {
      const { data } = await axiosAuth.patch(`${API.USERS}/${id}`, datas);
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

  const forgotPasswordMutation = useMutation<
    { message: string },
    Error,
    { email: string }
  >({
    mutationFn: async (payload) => {
      const { data } = await axios.post(`${API.AUTH}/forgot-password`, payload);
      return data;
    },
    onSuccess: (data) => {
      showNotify("success", data.message || "Đã gửi email reset password");
    },
    onError: (err) => {
      showNotify("error", err.message || "Gửi email thất bại");
    },
  });

  return {
    user,
    users,
    isLoading,
    isLoadingUsers,
    isError,
    updateMutation,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingReset: forgotPasswordMutation.isPending,
    logout,
  };
};
