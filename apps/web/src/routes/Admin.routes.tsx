import { AdminLayouts } from "@web/layouts/AdminLayout";
import { RouteObject } from "react-router-dom";
import { Dashboard } from "@web/pages/admin/Dashboard";
import { Upload } from "@web/pages/admin/access-control/Upload";
import { Genre } from "@web/pages/admin/Genre";
import { Movie } from "@web/pages/admin/Movie";
import { User } from "@web/pages/admin/access-control/User";
import { AdminGuard } from "@web/components/AdminGuard";
import Cinemas from "@web/pages/admin/Cinemas";
import Product from "@web/pages/admin/Product";
import { Rooms } from "@web/pages/admin/Rooms";

export const AdminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminGuard />,
  children: [
    {
      element: <AdminLayouts />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "movies", element: <Movie /> },
        { path: "genres", element: <Genre /> },
        { path: "media", element: <Upload /> },
        { path: "users", element: <User /> },
        { path: "cinemas", element: <Cinemas /> },
        { path: "product", element: <Product /> },
        { path: "rooms", element: <Rooms /> },
      ],
    },
  ],
};
