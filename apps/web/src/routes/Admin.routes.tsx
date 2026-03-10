<<<<<<< HEAD
import AdminLayouts from "@web/layouts/AdminLayout";
=======

>>>>>>> f0a534e950a27397f8233be19c88a4cc435babcf
import { RouteObject } from "react-router-dom";
import Dashboard from "@web/pages/admin/Dashboard";
import { Upload } from "@web/pages/admin/access-control/Upload";
import { Genre } from "@web/pages/admin/Genre";
import { Movie } from "@web/pages/admin/Movie";
import { User } from "@web/pages/admin/access-control/User";
import { AdminGuard } from "@web/components/admin/AdminGuard";
import Cinemas from "@web/pages/admin/Cinemas";
import Product from "@web/pages/admin/Product";
import { Rooms } from "@web/pages/admin/Rooms";
import Promotion from "@web/pages/admin/promotion/Promotion";
import PromotionForm from "@web/pages/admin/promotion/PromotionForm";
import { AdminLayouts } from "@web/layouts/AdminLayout";

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
        {
          path: "promotions",
          children: [
            { index: true, element: <Promotion /> },
            { path: "create", element: <PromotionForm /> },
            { path: "edit/:id", element: <PromotionForm /> },
          ],
        },
      ],
    },
  ],
};
