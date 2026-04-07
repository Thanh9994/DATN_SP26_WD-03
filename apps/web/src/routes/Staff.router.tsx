import { StaffLayout } from '@web/layouts/StaffLayout';
import { RouteObject, Navigate } from 'react-router-dom';
import { StaffMovieListPage } from '../pages/staff/StaffMovieListPage';
export const StaffRoutes: RouteObject = {
  path: '/staff',
  element: <StaffLayout />,
  children: [
    { index: true, element: <Navigate to="movielist" replace /> },
    { path: 'movielist', element: < StaffMovieListPage/> },
  ],
};