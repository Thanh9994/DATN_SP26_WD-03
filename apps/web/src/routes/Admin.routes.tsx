import { AdminLayouts } from "@web/layouts/AdminLayout";
import { RouteObject } from "react-router-dom";
import { Dashboard } from "@web/pages/admin/Dashboard";
import { Upload } from "@web/pages/admin/Upload";
import { Genre } from "@web/pages/admin/Genre";
import { Movie } from "@web/pages/admin/Movie";
import { User } from "@web/pages/admin/User";

export const AdminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayouts />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: 'movies', element: <Movie /> },
    { path: "genres", element: <Genre /> },
    { path: "media", element: <Upload/> },
    { path: "users", element: <User/> },
  ],
};
