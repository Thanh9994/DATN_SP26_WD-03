import { Outlet } from 'react-router-dom';
import { StaffHeader } from './staff/StaffHeader';

export const StaffLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background-dark font-display">
      <StaffHeader />
      <Outlet />
    </div>
  );
};
