import { Layout, Menu, Input, Avatar, Dropdown } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ContainerOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

const { Sider, Content, Header } = Layout;

export const AdminLayouts = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const user = { username: "Admin", avatar: null };

  const menuItems = [
    {
        key: "logout",
        label: "Logout",
        onClick: () => navigate("/login"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
        <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        style={{ background: "#001529" }}
        >
        <div
          style={{
            height: 64,
            margin: 16,
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
            userSelect: "none",
          }}
        >
          <Link to={"/admin"}>Admin</Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/admin"),
            },
            {
              key: "theloai",
              icon: <ContainerOutlined />,
              label: "Thể Loại",
              onClick: () => navigate("/admin/theloai"),
            },
            {
              key: "phim",
              icon: <ShoppingOutlined />,
              label: "Phim",
              onClick: () => navigate("/admin/phim"),
            },
            {
              key: "users",
              icon: <UserOutlined />,
              label: "Users",
              onClick: () => navigate("/admin/users"),
            },
            {
              key: "upload",
              icon: <UploadOutlined />,
              label: "Upload",
              onClick: () => navigate("/admin/upload"),
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "transparent",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {collapsed ? (
              <MenuUnfoldOutlined
                onClick={toggleCollapsed}
                style={{ fontSize: 20, cursor: "pointer" }}
              />
            ) : (
              <MenuFoldOutlined
                onClick={toggleCollapsed}
                style={{ fontSize: 20, cursor: "pointer" }}
              />
            )}
            <Input.Search
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 350 }}
              allowClear
            />
          </div>

          {user ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <Avatar
                src={user.avatar || undefined}
                size="large"
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {!user.avatar && user.username?.[0].toUpperCase()}
              </Avatar>
            </Dropdown>
          ) : (
            <Avatar size="large" icon={<UserOutlined />} />
          )}
        </Header>

        <Content style={{ margin: 16, padding: 24, background: "#f0f2f5" }}>
          <Outlet context={{ search }} />
        </Content>
      </Layout>
    </Layout>
  );
};
