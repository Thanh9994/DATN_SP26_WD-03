import { PayCircleFilled, SettingOutlined, BookOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { User } from 'lucide-react';
import '../styles/profile.css';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.split('/').pop() || 'info';

  const menuItems = [
    {
      key: 'info',
      icon: <User size={20} />,
      label: 'Thông tin cá nhân',
      onClick: () => navigate('/profile/info'),
    },
    {
      key: 'tickets',
      icon: <BookOutlined size={20} />,
      label: 'Lịch sử đặt vé',
      onClick: () => navigate('/profile/tickets'),
    },
    {
      key: 'payment',
      icon: <PayCircleFilled size={20} />,
      label: 'Phương thức thanh toán',
      onClick: () => navigate('/profile/payment'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined size={20} />,
      label: 'Cài đặt tài khoản',
      onClick: () => navigate('/profile/settings'),
    },
  ];
  const dropdownItems = menuItems.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
  }));

  const currentLabel =
    menuItems.find((item) => item.key === selectedKey)?.label || 'Thông tin cá nhân';
  return (
    <div className="min-h-full overflow-x-hidden bg-[#120a0a] py-6 text-white lg:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-3 sm:px-4 lg:flex-row lg:gap-6 lg:px-5">
        {/* Sidebar */}
        <aside className="hidden h-fit space-y-2 lg:sticky lg:block lg:w-1/4">
          <h1 className="px-4 text-3xl font-bold tracking-tight">Tài khoản</h1>
          <Menu
            theme="dark"
            mode="vertical"
            selectedKeys={[selectedKey]}
            items={menuItems}
            className="profile-menu !border-none !bg-transparent !text-base !font-semibold !text-white"
          />
        </aside>
        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          <div className="mb-2 px-1 lg:hidden">
            <Dropdown
              menu={{
                items: dropdownItems,
                onClick: ({ key }) => navigate(`/profile/${key}`),
                selectedKeys: [selectedKey],
              }}
              trigger={['click']}
            >
              <Button className="flex items-center justify-between !border-none !bg-red-500/40 !text-white">
                {currentLabel}
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="min-h-[60vh] lg:p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
