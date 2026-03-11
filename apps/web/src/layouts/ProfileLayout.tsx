import {
  PayCircleFilled,
  SettingOutlined,
  BookOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import { User } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.split("/").pop() || "info";

  const menuItems = [
    {
      key: "info",
      icon: <User size={20} />,
      label: "Thông tin cá nhân",
      onClick: () => navigate("/profile/info"),
    },
    {
      key: "tickets",
      icon: <BookOutlined size={20} />,
      label: "Lịch sử đặt vé",
      onClick: () => navigate("/profile/tickets"),
    },
    {
      key: "payment",
      icon: <PayCircleFilled size={20} />,
      label: "Phương thức thanh toán",
      onClick: () => navigate("/profile/payment"),
    },
    {
      key: "settings",
      icon: <SettingOutlined size={20} />,
      label: "Cài đặt tài khoản",
      onClick: () => navigate("/profile/settings"),
    },
  ];
  const dropdownItems = menuItems.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
  }));

  const currentLabel =
    menuItems.find((item) => item.key === selectedKey)?.label ||
    "Thông tin cá nhân";
  return (
    <div className="min-h-full bg-[#120a0a] text-white py-6 lg:py-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 flex flex-col lg:flex-row gap-6 lg:gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-1/4 lg:sticky h-fit space-y-2">
          <h1 className="text-3xl font-bold tracking-tight px-4">Tài khoản</h1>
          <Menu
            theme="dark"
            mode="vertical"
            selectedKeys={[selectedKey]}
            items={menuItems}
            className="profile-menu !bg-transparent !border-none !text-white !text-base !font-semibold"
          />
        </aside>
        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          <div className="lg:hidden px-1 mb-2">
            <Dropdown
              menu={{
                items: dropdownItems,
                onClick: ({ key }) => navigate(`/profile/${key}`),
                selectedKeys: [selectedKey],
              }}
              trigger={["click"]}
            >
              <Button className=" !bg-red-500/40 !border-none !text-white flex justify-between items-center">
                {currentLabel}
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="lg:p-4 min-h-[60vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
