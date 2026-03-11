import { NotFound } from "@web/components/NotFound";
import { ClientLayout } from "@web/layouts/ClientLayout";
import About from "@web/pages/About";
import Event from "@web/pages/Event";
import Contact from "@web/pages/Contact";
import ForgotPassword from "@web/pages/clients/ForgotPassword";
import { Home } from "@web/pages/clients/Home";
import Login from "@web/pages/clients/Login";
import Register from "@web/pages/clients/Register";
import SeatBooking from "@web/pages/clients/booking/SeatBooking";
import Showtime from "@web/pages/ShowTime";
import { RouteObject } from "react-router-dom";
import Ticket from "@web/pages/Ticket";
import Checkout from "@web/pages/CheckOut";
import MovieDetail from "@web/pages/clients/MovieDetail";
import BookingLayout from "@web/layouts/BookingLayout";
import { BookingCinema } from "@web/pages/clients/booking/BookingCinema";
import { ProfileLayout } from "@web/layouts/ProfileLayout";
import { ProfileInfo } from "@web/components/authProfile/ProfileInfo";
import { Setting } from "@web/components/authProfile/Setting";
import { Cinemas } from "@web/pages/Cinemas";
import MyBooking  from "@web/components/authProfile/MyBooking";
import DrinkSnack from "@web/pages/DrinkSnack";
import RecommentDrinkSnack from "@web/pages/RecommentDrinkSnack";
import DetailTicket from "@web/pages/DetailTicket";
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
        { path: "tickets", element: <MyBooking /> },
        { path: "payment", element: <div>Phương thức thanh toán</div> },
      ],
    },
    { path: "about", element: <About /> },
    { path: "event", element: <Event /> },
    { path: "cinema", element: <Cinemas /> },
    // { path: "movielist", element: <MovieList /> },
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
    { path: "foods", element: <DrinkSnack /> },
    { path: "recommendfoods", element: <RecommentDrinkSnack /> },
    { path: "checkout", element: <Checkout /> },
    { path: "contact", element: <Contact /> },
    { path: "detailticket", element: <DetailTicket /> },
    { path: "*", element: <NotFound /> },
  ],
};