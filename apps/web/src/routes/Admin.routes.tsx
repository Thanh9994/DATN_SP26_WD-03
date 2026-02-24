import { Upload } from "@web/pages/admin/Upload";
import { AdminLayouts } from "@web/layouts/AdminLayout";
import { RouteObject } from "react-router-dom";
import { Dashboard } from "@web/pages/admin/Dashboard";

export const AdminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayouts />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "upload", element: <Upload /> },
  ],
};
