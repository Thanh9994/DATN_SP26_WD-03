import { StaffLayout } from '@web/layouts/StaffLayout';
import { RouteObject, Navigate } from 'react-router-dom';
import { StaffMovieListPage } from '../pages/staff/StaffMovieListPage';
import { StaffDashboard } from '../pages/staff/StaffDashboard';
import BookingLayout from '@web/layouts/BookingLayout';
import { BookingCinema } from '@web/pages/clients/booking/BookingCinema';
import SeatBooking from '@web/pages/clients/booking/SeatBooking';
import PaymentsMethod from '@web/pages/clients/payments/PaymentMethod';
import { PaymentResult } from '@web/pages/clients/payments/PaymentResult';
import RequireAuth from '@web/pages/services/RequieAuth';

export const StaffRoutes: RouteObject = {
  path: '/staff',
  element: <StaffLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <StaffDashboard /> },
    { path: 'movielist', element: <StaffMovieListPage /> },
    {
      path: 'booking',
      element: (
        <RequireAuth>
          <BookingLayout />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <BookingCinema /> },
        {
          path: 'seats',
          element: (
            <RequireAuth>
              <SeatBooking />
            </RequireAuth>
          ),
        },
      ],
    },
    {
      path: 'payments',
      element: (
        <RequireAuth>
          <PaymentsMethod />
        </RequireAuth>
      ),
      children: [{ path: 'payment-result', element: <PaymentResult /> }],
    },
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
