import { StaffLayout } from '@web/layouts/StaffLayout';
<<<<<<< HEAD
import { RouteObject } from 'react-router-dom';

export const StaffRoutes: RouteObject = {
  path: '/staff',
  element: <StaffLayout />,
  children: [{ path: 'movielist', element: <div>Danh sách phim theo rạp</div> }],
=======
import { RouteObject, Navigate } from 'react-router-dom';
import { StaffMovieListPage } from '../pages/staff/StaffMovieListPage';
export const StaffRoutes: RouteObject = {
  path: '/staff',
  element: <StaffLayout />,
  children: [
    { index: true, element: <Navigate to="movielist" replace /> },
    { path: 'movielist', element: < StaffMovieListPage/> },
    {
      path: 'checkin',
      element: (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white">
          Su dung nut "Check-in ve" tren Header de nhap ticket code va xac nhan lay ve.
        </div>
      ),
    },
  ],
>>>>>>> 64d42bd0f920d00cf347de990cf667ff267b9d41
};
