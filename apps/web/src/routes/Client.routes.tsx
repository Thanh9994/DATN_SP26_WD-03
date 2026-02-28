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
import MovieDetail from "@web/pages/clients/MovieDetail";
import Ticket from "@web/pages/Ticket";
import Checkout from "@web/pages/CheckOut";
export const ClientRoutes: RouteObject = {
  path: "/",
  element: <ClientLayout />,
  children: [
    { path: "", element: <Home /> },
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "about", element: <About /> },
    { path: "event", element: <Event /> },
    { path: "booking", element: <SeatBooking /> },
    { path: "movie/:id", element: <MovieDetail /> },
    { path: "showtime", element: <Showtime /> },
    { path: "ticket", element: <Ticket /> },
    { path: "*", element: <NotFound /> },
    { path: "checkout", element: <Checkout /> },
  ],
};
