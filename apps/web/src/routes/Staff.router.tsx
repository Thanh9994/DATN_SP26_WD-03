import { StaffLayout } from '@web/layouts/StaffLayout';
import { RouteObject } from 'react-router-dom';

export const StaffRoutes: RouteObject = {
  path: '/staff',
  element: <StaffLayout />,
  children: [{ path: 'movielist', element: <div>Danh sách phim theo rạp</div> }],
};
