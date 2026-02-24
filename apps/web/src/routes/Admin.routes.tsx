import { AdminLayouts } from "@web/layouts/AdminLayout";
import { RouteObject } from "react-router-dom";
import { Dashboard } from "@web/pages/admin/Dashboard";
import { Upload } from "@web/pages/admin/Upload";

export const AdminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayouts />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "media", element: <Upload/> },
  ],
};
