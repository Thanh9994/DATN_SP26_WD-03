import { RouteObject } from 'react-router-dom';
import { NotFound } from '@web/components/tools/NotFound';

// Layouts
import { ClientLayout } from '@web/layouts/ClientLayout';
import BookingLayout from '@web/layouts/BookingLayout';
import { ProfileLayout } from '@web/layouts/ProfileLayout';

// Public pages
import { Home } from '@web/pages/clients/public/Home';
import About from '@web/pages/clients/public/About';
import Event from '@web/pages/clients/public/Event';
import News from '@web/pages/clients/public/News';
import NewsDetail from '@web/pages/clients/public/NewDetail';
import Contact from '@web/pages/clients/public/Contact';

// Auth pages
import Login from '@web/pages/clients/auth/Login';
import Register from '@web/pages/clients/auth/Register';
import ForgotPassword from '@web/pages/clients/auth/ForgotPassword';
import ResetPassword from '@web/pages/clients/auth/ResetPassword';

// Movie / cinema / booking pages
import MovieList from '@web/pages/clients/movie/MovieList';
import MovieDetail from '@web/pages/clients/movie/MovieDetail';
import Showtime from '@web/pages/clients/booking/ShowTime';
import SeatBooking from '@web/pages/clients/booking/SeatBooking';
import { BookingCinema } from '@web/pages/clients/booking/BookingCinema';
import Cinemas from '@web/pages/Cinemas';
import CinemaDetail from '@web/pages/CinemaDetail';
import DrinkSnack from '@web/pages/DrinkSnack';
import RecommentDrinkSnack from '@web/pages/RecommentDrinkSnack';
import Ticket from '@web/pages/Ticket';

// Payment pages
import PaymentsMethod from '@web/pages/clients/payments/PaymentMethod';
import { PaymentResult } from '@web/pages/clients/payments/PaymentResult';

// Profile pages
import { ProfileInfo } from '@web/components/authProfile/ProfileInfo';
import { Setting } from '@web/components/authProfile/Setting';
import MyBooking from '@web/components/authProfile/MyBooking';
import BookingDetail from '@web/components/authProfile/BookingDetail';

// Guards
import RequireAuth from '@web/services/RequieAuth';

export const ClientRoutes: RouteObject = {
  path: '/',
  element: <ClientLayout />,
  children: [
    { index: true, element: <Home /> },

    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'forgot-password', element: <ForgotPassword /> },
    { path: 'reset-password/:token', element: <ResetPassword /> },

    {
      path: 'profile',
      element: (
        <RequireAuth>
          <ProfileLayout />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <ProfileInfo /> },
        { path: 'info', element: <ProfileInfo /> },
        { path: 'settings', element: <Setting /> },
        { path: 'tickets', element: <MyBooking /> },
        { path: 'payment', element: <div>Phuong thuc thanh toan</div> },
      ],
    },

    {
      path: 'my-booking/:id',
      element: (
        <RequireAuth>
          <BookingDetail />
        </RequireAuth>
      ),
    },

    { path: 'about', element: <About /> },
    { path: 'event', element: <Event /> },

    {
      path: 'news',
      children: [
        { index: true, element: <News /> },
        { path: ':slug', element: <NewsDetail /> },
      ],
    },

    { path: 'cinema', element: <Cinemas /> },
    { path: 'cinemadetail/:id', element: <CinemaDetail /> },
    { path: 'movielist', element: <MovieList /> },
    { path: 'movie/:id', element: <MovieDetail /> },
    { path: 'showtime', element: <Showtime /> },
    { path: 'foods', element: <DrinkSnack /> },
    { path: 'recommendfoods', element: <RecommentDrinkSnack /> },

    {
      path: 'booking',
      element: <BookingLayout />,
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
      element: <PaymentsMethod />,
      children: [{ path: 'payment-result', element: <PaymentResult /> }],
    },

    { path: 'ticket', element: <Ticket /> },
    { path: 'contact', element: <Contact /> },
    { path: '*', element: <NotFound /> },
  ],
};