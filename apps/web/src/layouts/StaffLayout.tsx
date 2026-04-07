import { Outlet } from 'react-router-dom';
import { StaffHeader } from './staff/StaffHeader';

export const StaffLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background-dark font-display text-white">
      <StaffHeader />
      <main className="flex-1 px-6 py-4">
        <Outlet />
      </main>
    </div>
  );
};