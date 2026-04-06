import { RouteObject } from 'react-router-dom';

import { Upload } from '@web/pages/admin/access-control/Upload';
import { Genre } from '@web/pages/admin/cinema-catalog/Genre';
import { Movie } from '@web/pages/admin/cinema-catalog/Movie';
import { User } from '@web/pages/admin/access-control/User';
import { AdminGuard } from '@web/components/admin/AdminGuard';
import Cinemas from '@web/pages/admin/cinema-catalog/Cinemas';
import Product from '@web/pages/admin/order/Product';
import { Rooms } from '@web/pages/admin/cinema-catalog/Rooms';
import Promotion from '@web/pages/admin/promotion/Promotion';
import PromotionForm from '@web/pages/admin/promotion/PromotionForm';
import { AdminLayouts } from '@web/layouts/AdminLayout';
import Settings from '@web/pages/admin/Settings';
import Dashboard from '@web/pages/admin/Dashboard';
import { ShowTime } from '@web/pages/admin/order/Showtime';
import { Personnel } from '@web/pages/admin/access-control/Personnel';
import Analytics from '@web/pages/admin/Analytics';
import Ticketlog from '@web/pages/admin/analytics/analyticsTicket/Ticketlog';
import Overview from '@web/pages/admin/analytics/analyticsOverview/overview';

export const AdminRoutes: RouteObject = {
  path: '/admin',
  element: <AdminGuard />,
  children: [
    {
      element: <AdminLayouts />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'movies', element: <Movie /> },
        { path: 'genres', element: <Genre /> },
        { path: 'media', element: <Upload /> },
        { path: 'users', element: <User /> },
        { path: 'cinemas', element: <Cinemas /> },
        { path: 'product', element: <Product /> },
        { path: 'rooms', element: <Rooms /> },
        { path: 'settings', element: <Settings /> },
        { path: 'showtime', element: <ShowTime /> },
        { path: 'personnel', element: <Personnel /> },
        { path: "analytics", element: <Analytics /> },
        {
          path: 'promotions',
          children: [
            { index: true, element: <Promotion /> },
            { path: 'create', element: <PromotionForm /> },
            { path: 'edit/:id', element: <PromotionForm /> },
          ],
        },
        {
          path: "analytics",
          children: [
            { index: true, element: <Analytics /> }, 
            { path: "ticket", element: <Ticketlog /> }, 
            { path: "overview", element: <Overview /> },
          ]
        }
      ],
    },
  ],
};