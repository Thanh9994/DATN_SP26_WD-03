import { Outlet } from 'react-router-dom';
import { StaffHeader } from './staff/StaffHeader';

export const StaffLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <StaffHeader />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        <div className="relative z-10 min-h-[calc(100vh-80px)] px-3 py-4 md:px-6 md:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};