import { NotFound } from "@web/components/NotFound";
import { ClientLayout } from "@web/layouts/ClientLayout";
import About from "@web/pages/About";
import Event from "@web/pages/Event";
import { ForgotPassword } from "@web/pages/clients/ForgotPassword";
import { Home } from "@web/pages/Home";
import Login from "@web/pages/clients/Login";
import { Register } from "@web/pages/clients/Register";
import SeatBooking from "@web/pages/SeatBooking";
import Showtime from "@web/pages/ShowTime";
import { RouteObject } from "react-router-dom";
import Ticket from "@web/pages/Ticket";
import Checkout from "@web/pages/CheckOut";
import { BookingPage } from "@web/components/mockup";
import MovieDetail from "@web/pages/clients/MovieDetail";
import { DemoTrailer } from "@web/pages/Trailer";

export const ClientRoutes: RouteObject = {
  path: "/",
  element: <ClientLayout />,
  children: [
    { path: "", element: <Home /> },
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "about", element: <About /> },
    { path: "seatmap", element: <BookingPage /> },
    { path: "bookingpage", element: <BookingPage /> },
    { path: "event", element: <Event /> },
    { path: "booking", element: <SeatBooking /> },
    { path: "movie/:id", element: <MovieDetail /> },
    { path: "showtime", element: <Showtime /> },
    { path: "ticket", element: <Ticket /> },
    { path: "checkout", element: <Checkout /> },
    { path: "*", element: <NotFound /> },
    { path: "demo", element: <DemoTrailer /> },
  ],
};
