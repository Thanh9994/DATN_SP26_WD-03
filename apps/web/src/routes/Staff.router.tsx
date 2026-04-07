import { StaffLayout } from '@web/layouts/StaffLayout';
import { RouteObject, Navigate } from 'react-router-dom';
import { StaffMovieListPage } from '../pages/staff/StaffMovieListPage';
export const StaffRoutes: RouteObject = {
  path: '/staff',
  element: <StaffLayout />,
  children: [
    { index: true, element: <Navigate to="movielist" replace /> },
    { path: 'movielist', element: <StaffMovieListPage /> },
    {
      path: 'checkin',
      element: (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white">
          Su dung nut "Check-in ve" tren Header de nhap ticket code va xac nhan lay ve.
        </div>
      ),
    },
  ],
};
