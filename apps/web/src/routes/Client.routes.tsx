
import { NotFound } from "@web/components/NotFound";
import { ClientLayout } from "@web/layouts/ClientLayout";
import About from "@web/pages/About";
import Event from "@web/pages/Event";
import { ForgotPassword } from "@web/pages/ForgotPassword";
import { Home } from "@web/pages/Home";
import Login from "@web/pages/Login";
import Register from "@web/pages/Register";
import { RouteObject } from "react-router-dom";
import Ticket from "@web/pages/Ticket";
export const ClientRoutes: RouteObject = {
  path: "/",
  element: <ClientLayout />,
  children: [
    { path: "", element: <Home /> },
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "about", element: <About /> },
    { path: "*", element: <NotFound /> },
    { path: "event", element: <Event /> },
    { path: "ticket", element: <Ticket /> },
  ],
};