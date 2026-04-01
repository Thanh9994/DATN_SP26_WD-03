import { NotFound } from '@web/components/tools/NotFound';

// Public
import { Home } from '@web/pages/clients/public/Home';
import About from '@web/pages/clients/public/About';
import Event from '@web/pages/clients/public/Event';
import News from '@web/pages/clients/public/News';
import { ClientLayout } from '@web/layouts/ClientLayout';
import ForgotPassword from '@web/pages/clients/auth/ForgotPassword';
import Login from '@web/pages/clients/auth/Login';
import SeatBooking from '@web/pages/clients/booking/SeatBooking';
import Showtime from '@web/pages/clients/booking/ShowTime';
import { RouteObject } from 'react-router-dom';
import MovieDetail from '@web/pages/clients/movie/MovieDetail';
import BookingLayout from '@web/layouts/BookingLayout';
import { BookingCinema } from '@web/pages/clients/booking/BookingCinema';
import { ProfileLayout } from '@web/layouts/ProfileLayout';
import { ProfileInfo } from '@web/components/authProfile/ProfileInfo';
import { Setting } from '@web/components/authProfile/Setting';
import Cinemas from '@web/pages/Cinemas';
import MyBooking from '@web/components/authProfile/MyBooking';
import DrinkSnack from '@web/pages/DrinkSnack';
import RecommentDrinkSnack from '@web/pages/RecommentDrinkSnack';
import MovieList from '@web/pages/clients/movie/MovieList';
import NewsDetail from '@web/pages/clients/public/NewDetail';
import RequireAuth from '@web/services/RequieAuth';
import ResetPassword from '@web/pages/clients/auth/ResetPassword';
import { PaymentResult } from '@web/pages/clients/payments/PaymentResult';
import CinemaDetail from '@web/pages/CinemaDetail';
import Contact from '@web/pages/clients/public/Contact';

import PaymentsMethod from '@web/pages/clients/payments/PaymentMethod';
import Ticket from '@web/pages/Ticket';
import Register from '@web/pages/clients/auth/Register';

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
      element: <ProfileLayout />,
      children: [
        { index: true, element: <ProfileInfo /> },
        { path: 'info', element: <ProfileInfo /> },
        { path: 'settings', element: <Setting /> },
        { path: 'tickets', element: <MyBooking /> },
        { path: 'payment', element: <div>Phương thức thanh toán</div> },
      ],
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
    { path: 'movielist', element: <MovieList /> },
    { path: 'cinemadetail/:id', element: <CinemaDetail /> },
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

    { path: 'movie/:id', element: <MovieDetail /> },
    { path: 'showtime', element: <Showtime /> },
    { path: 'foods', element: <DrinkSnack /> },
    { path: 'recommendfoods', element: <RecommentDrinkSnack /> },

    {
      path: 'payments',
      element: <PaymentsMethod />,
      children: [
       
        { path: 'result', element: <PaymentResult /> },
      ],
    },

    { path: 'payment-result', element: <PaymentResult /> },
    { path: 'ticket', element: <Ticket /> },
    { path: 'contact', element: <Contact /> },
    { path: '*', element: <NotFound /> },
  ],
};
