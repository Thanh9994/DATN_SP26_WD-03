import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@web/hooks/useAuth";
import { Spin } from "antd";

export const AdminGuard = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spin size="large" /></div>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};