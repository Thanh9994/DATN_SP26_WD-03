import { Layout, Input, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./admin/Navbar";
import { useAuth } from "@web/hooks/useAuth";

const { Content, Header } = Layout;

export const AdminLayouts = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const menuItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      danger: true,
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />

      <Layout>
        <Header style={{ background: "#fff", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,21,41,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ fontSize: 18, cursor: "pointer" }} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ fontSize: 18, cursor: "pointer" }} />
            )}
            <Input.Search
              placeholder="Tìm kiếm nhanh..."
              onSearch={(value) => setSearch(value)}
              style={{ width: 300 }}
              allowClear
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 500 }}>{user?.ho_ten || "Đang tải..."}</span>
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <Avatar
                size="large"
                src={user?.avatar?.url} // Dùng ảnh từ Cloudinary nếu có
                icon={!user?.avatar && <UserOutlined />}
                style={{ cursor: "pointer", backgroundColor: "#1890ff" }}
              >
                {user?.ho_ten?.[0].toUpperCase()}
              </Avatar>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", borderRadius: 8, minHeight: 280 }}>
          <Outlet context={{ search }} />
        </Content>
      </Layout>
    </Layout>
  );
};
