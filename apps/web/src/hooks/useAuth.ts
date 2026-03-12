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

const getStoredToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// Axios instance có gắn token
export const axiosAuth = axios.create();

axiosAuth.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosAuth.interceptors.response.use(
  (response) => response, // Trả về data nếu thành công
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa local cache cũ khi token logout hết hạn hoặc lỗi
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      // Tùy chọn: Chuyển hướng về login
    }
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
    enabled: !!getStoredToken(),
    retry: false,
    gcTime: 1000 * 60 * 60 * 2, // Giữ trong cache 24h
  });

  const loginMutation = useMutation<
    IAuthResponse,
    Error,
    ILogin & { remember?: boolean }
  >({
    mutationFn: async (payload) => {
      const { remember, ...loginData } = payload;
      const { data } = await axiosAuth.post<IAuthResponse>(
        `${API.AUTH}/login`,
        loginData,
      );
      return { ...data, remember };
    },
    onSuccess: (data) => {
      const storage = data.remember ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["me"], data.user);
      showNotify(
        "success",
        "Đăng Nhập Thành Công",
        `Chào mừng ${data.user.ho_ten}!`,
      );
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      // showNotify("success", "Đăng nhập thất bại");
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
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.clear();
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
