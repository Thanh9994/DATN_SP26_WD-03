import { Navigate } from 'react-router-dom';
import { useAuth } from '@web/hooks/useAuth';

export const StaffGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!['staff', 'manager', 'admin'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};