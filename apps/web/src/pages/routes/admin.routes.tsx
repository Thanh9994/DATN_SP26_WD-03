// routes/admin.routes.tsx
import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Movies from "../pages/admin/Movies";

export const adminRoutes = (
    <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="movies" element={<Movies />} />
    </Route>
);
