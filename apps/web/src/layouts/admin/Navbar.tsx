import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  ContainerOutlined,
  ProductOutlined,
  CloudUploadOutlined,
  VideoCameraAddOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

export const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.split("/").pop() || "dashboard";

  const items = [
    {
      key: "admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "genres",
      icon: <ContainerOutlined />,
      label: "Thể Loại",
      onClick: () => navigate("/admin/genres"),
    },
    {
      key: "movies",
      icon: <ShoppingOutlined />,
      label: "Phim",
      onClick: () => navigate("/admin/movies"),
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => navigate("/admin/users"),
    },
    {
      key: "media",
      icon: <CloudUploadOutlined />,
      label: "Media",
      onClick: () => navigate("/admin/media"),
    },
    {
      key: "cinemas",
      icon: <VideoCameraAddOutlined />,
      label: "Cinemas",
      onClick: () => navigate("/admin/cinemas"),
    },
    {
      key: "product",
      icon: <ProductOutlined />,
      label: "Product",
      onClick: () => navigate("/admin/product"),
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      theme="dark"
    >
      <div
      className="justify-between"
        style={{
          height: 64,
          margin: 16,
          color: "#fff",
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        <ArrowLeftOutlined  onClick={() => navigate("/")} style={{ paddingRight: 20}}/>
        <Link to="/admin" style={{ color: "inherit" }}>
          ADMIN PANELS
        </Link>
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
