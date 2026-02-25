import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  ContainerOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

export const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định menu đang active dựa trên URL
  const selectedKey = location.pathname.split("/").pop() || "dashboard";

  const items = [
    { key: "admin", icon: <DashboardOutlined />, label: "Dashboard", onClick: () => navigate("/admin") },
    { key: "genres", icon: <ContainerOutlined />, label: "Thể Loại", onClick: () => navigate("/admin/genres") },
    { key: "movies", icon: <ShoppingOutlined />, label: "Phim", onClick: () => navigate("/admin/movies") },
    { key: "users", icon: <UserOutlined />, label: "Users", onClick: () => navigate("/admin/users") },
    { key: "media", icon: <UploadOutlined />, label: "Media", onClick: () => navigate("/admin/media") },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={260} theme="dark">
      <div style={{ height: 64, margin: 16, color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
        <Link to="/admin" style={{ color: "inherit" }}>ADMIN PANELS</Link>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
      />
    </Sider>
  );
};