import { NotFound } from "@web/components/tools/NotFound";
import { ClientLayout } from "@web/layouts/ClientLayout";
import About from "@web/pages/clients/public/About";
import Event from "@web/pages/clients/public/Event";
import Contact from "@web/pages/clients/public/Contact";
import ForgotPassword from "@web/pages/clients/auth/ForgotPassword";
import { Home } from "@web/pages/clients/public/Home";
import Login from "@web/pages/clients/auth/Login";
import Register from "@web/pages/clients/auth/Register";
import SeatBooking from "@web/pages/clients/booking/SeatBooking";
import Showtime from "@web/pages/clients/booking/ShowTime";
import { RouteObject } from "react-router-dom";
import MovieDetail from "@web/pages/clients/MovieDetail";
import BookingLayout from "@web/layouts/BookingLayout";
import { BookingCinema } from "@web/pages/clients/booking/BookingCinema";
import { ProfileLayout } from "@web/layouts/ProfileLayout";
import { ProfileInfo } from "@web/components/authProfile/ProfileInfo";
import { Setting } from "@web/components/authProfile/Setting";
import { Cinemas } from "@web/pages/Cinemas";
import MyBooking from "@web/components/authProfile/MyBooking";
import DrinkSnack from "@web/pages/DrinkSnack";
import RecommentDrinkSnack from "@web/pages/RecommentDrinkSnack";
import MovieList from "@web/pages/clients/MovieList";
import NewsDetail from "@web/pages/clients/NewDetail";
import PaymentsMethod from "@web/pages/clients/payments/PaymentMethod";
import VNPayReturn from "@web/pages/clients/payments/Vnpay-return";
import News from "@web/pages/clients/public/News";
import ResetPassword from "@web/pages/clients/auth/ResetPassword";

export const ClientRoutes: RouteObject = {
  path: "/",
  element: <ClientLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "reset-password/:token", element: <ResetPassword /> },
    {
      path: "profile",
      element: <ProfileLayout />,
      children: [
        { index: true, element: <ProfileInfo /> },
        { path: "info", element: <ProfileInfo /> },
        { path: "settings", element: <Setting /> },
        { path: "tickets", element: <MyBooking /> },
        { path: "payment", element: <div>Phương thức thanh toán</div> },
      ],
    },
    { path: "about", element: <About /> },
    { path: "event", element: <Event /> },
    {
      path: "news",
      children: [
        { index: true, element: <News /> },
        { path: ":slug", element: <NewsDetail /> },
      ],
    },
    { path: "cinema", element: <Cinemas /> },
    { path: "movielist", element: <MovieList /> },
    {
      path: "booking",
      element: <BookingLayout />,
      children: [
        { index: true, element: <BookingCinema /> },
        { path: "seats", element: <SeatBooking /> },
      ],
    },
    { path: "movie/:id", element: <MovieDetail /> },
    { path: "showtime", element: <Showtime /> },
    { path: "foods", element: <DrinkSnack /> },
    { path: "recommendfoods", element: <RecommentDrinkSnack /> },
    { path: "payments", element: <PaymentsMethod /> },
    { path: "vnpay-return", element: <VNPayReturn /> },
    { path: "contact", element: <Contact /> },
    { path: "news", element: <News /> },
    { path: "*", element: <NotFound /> },
  ],
};
