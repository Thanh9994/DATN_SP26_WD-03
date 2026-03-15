import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@web/hooks/useAuth';
import { Spin } from 'antd';

export const AdminGuard = () => {
  const { user, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );

  if (!user || !['admin', 'manager'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
