import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Users from "./pages/admin/Users";
import Dashboard from "./pages/admin/Dashboard";
import Movies from "./pages/admin/Movies";
import Cinemas from "./pages/admin/Cinemas";
import Bookings from "./pages/admin/Bookings";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import "./styles/admin.css";
import Reports from "./pages/admin/Reports";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="movies" element={<Movies />} />
        <Route path="cinemas" element={<Cinemas />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
