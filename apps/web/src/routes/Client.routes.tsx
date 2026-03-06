import { NotFound } from "@web/components/NotFound";
import { ClientLayout } from "@web/layouts/ClientLayout";
import About from "@web/pages/About";
import Event from "@web/pages/Event";
import ForgotPassword from "@web/pages/clients/ForgotPassword";
import { Home } from "@web/pages/clients/Home";
import Login from "@web/pages/clients/Login";
import Register from "@web/pages/clients/Register";
import SeatBooking from "@web/pages/admin/booking/SeatBooking";
import Showtime from "@web/pages/admin/booking/ShowTime";
import { RouteObject } from "react-router-dom";
import Ticket from "@web/pages/Ticket";
import Checkout from "@web/pages/CheckOut";
import MovieDetail from "@web/pages/clients/MovieDetail";
import BookingLayout from "@web/layouts/BookingLayout";
import { BookingCinema } from "@web/pages/admin/booking/BookingCinema";
import { ProfileLayout } from "@web/layouts/ProfileLayout";
import { ProfileInfo } from "@web/components/authProfile/ProfileInfo";
import { Setting } from "@web/components/authProfile/Setting";
import { Cinemas } from "@web/pages/Cinemas";

export const ClientRoutes: RouteObject = {
  path: "/",
  element: <ClientLayout />,
  children: [
    { path: "", element: <Home /> },
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    {
      path: "profile",
      element: <ProfileLayout />,
      children: [
        { index: true, element: <ProfileInfo /> },
        { path: "info", element: <ProfileInfo /> },
        { path: "settings", element: <Setting /> },
        { path: "tickets", element: <div>Lịch sử đặt vé</div> },
        { path: "payment", element: <div>Phương thức thanh toán</div> },
      ],
    },
    { path: "about", element: <About /> },
    { path: "event", element: <Event /> },
    { path: "cinema", element: <Cinemas /> },
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
    { path: "ticket", element: <Ticket /> },
    { path: "checkout", element: <Checkout /> },
    { path: "*", element: <NotFound /> },
  ],
};
