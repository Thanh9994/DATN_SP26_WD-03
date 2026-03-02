import { NavLink, Outlet } from "react-router-dom";
import { Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <aside className="sidebar">
        {/* ===== SIDEBAR HEADER (ĐÃ SỬA) ===== */}
        <div
          style={{
            padding: "20px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Avatar
            size={44}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1677ff" }}
          />
          <div>
            <Text style={{ color: "#fff", fontWeight: 600 }}>
              Admin Panel
            </Text>
            <br />
            <Text style={{ color: "#aaa", fontSize: 12 }}>
              Super Admin
            </Text>
          </div>
        </div>

        {/* ===== MENU ===== */}
        <nav>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : undefined}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : undefined}>
            Users
          </NavLink>
          <NavLink to="/admin/movies" className={({ isActive }) => isActive ? "active" : undefined}>
            Movies
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "active" : undefined}>
            Settings
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "active" : undefined}>
            Analytics
          </NavLink>
          <NavLink to="/admin/reports" className={({ isActive }) => isActive ? "active" : undefined}>
            Reports
          </NavLink>
          <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? "active" : undefined}>
            Bookings
          </NavLink>
          <NavLink to="/admin/cinemas" className={({ isActive }) => isActive ? "active" : undefined}>
            Cinemas
          </NavLink>
        </nav>
      </aside>

      {/* ===== CONTENT ===== */}
      <div className="content">
        <header className="header">
          <span>Xin chào Admin</span>
          <button>Logout</button>
        </header>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
