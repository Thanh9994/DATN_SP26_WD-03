import { Layout, Input, ConfigProvider, theme, Badge } from "antd";
import {
  BellOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./admin/Navbar";
import { useAuth } from "@web/hooks/useAuth";

const { Content, Header } = Layout;

export const AdminLayouts = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleTheme = (checked: boolean) => {
    setThemeMode(checked ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: "#1890ff" },
      }}
    >
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: "all 0.2s",
          minHeight: "100vh",
        }}
      >
        <Sidebar
          collapsed={collapsed}
          themeMode={themeMode}
          toggleTheme={toggleTheme}
          user={user}
          logout={handleLogout}
        />

        <Layout>
          {/* HEADER */}
          <Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: themeMode === "dark" ? "#141414" : "#fff",
              color: themeMode === "dark" ? "#fff" : "#000",
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            }}
          >
            <div className="flex items-center gap-4">
              {collapsed ? (
                <MenuUnfoldOutlined
                  onClick={() => setCollapsed(false)}
                  className="text-lg cursor-pointer"
                />
              ) : (
                <MenuFoldOutlined
                  onClick={() => setCollapsed(true)}
                  className="text-lg cursor-pointer"
                />
              )}

              <Input.Search
                placeholder="Tìm kiếm nhanh..."
                allowClear
                onSearch={(value) => setSearch(value)}
                className="hidden md:block w-[280px]"
              />
            </div>
            <div className="flex justify-end gap-5 mr-4">
              <Badge count={5}>
                <BellOutlined className="text-xl cursor-pointer" />
              </Badge>

              <Badge count={2}>
                <MailOutlined className="text-xl cursor-pointer" />
              </Badge>
            </div>
          </Header>

          {/* CONTENT */}
          <Content
            style={{
              margin: 16,
              borderRadius: 8,
              minHeight: 280,
            }}
          >
            <Outlet context={{ search }} />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default AdminLayouts;