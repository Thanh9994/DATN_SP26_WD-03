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
  return (
    <div className="h-auto bg-[#120a0a] text-white py-6 lg:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 flex flex-col lg:flex-row gap-6 lg:gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-1/4 lg:sticky h-fit space-y-2">
          <h1 className="text-3xl font-bold tracking-tight px-4">Tài khoản</h1>
          <Menu
            theme="dark"
            mode="vertical"
            selectedKeys={[selectedKey]}
            items={menuItems}
            className="profile-menu !bg-transparent !border-none !text-base !font-semibold"
          />
        </aside>
        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          <div className="lg:hidden px-4 mb-4">
            <Dropdown
              menu={{
                items: dropdownItems,
                onClick: ({ key }) => navigate(`/profile/${key}`),
                selectedKeys: [selectedKey],
              }}
              trigger={["click"]}
            >
              <Button className=" !bg-red-500/40 !border-none !text-white flex justify-between items-center">
                {selectedKey === "info"
                  ? "Thông tin cá nhân"
                  : selectedKey === "tickets"
                    ? "Lịch sử đặt vé"
                    : selectedKey === "payment"
                      ? "Phương thức thanh toán"
                      : "Cài đặt tài khoản"}
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 lg:p-4 min-h-[60vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
