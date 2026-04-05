import { Layout, Menu, Avatar, Switch, MenuProps } from 'antd';
import {
  UserOutlined,
  ProductOutlined,
  VideoCameraAddOutlined,
  ArrowLeftOutlined,
  SettingFilled,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3,
  CalendarPlus,
  Film,
  FolderOpen,
  Image,
  LayoutDashboard,
  MonitorPlay,
  Users,
} from 'lucide-react';

type SidebarProps = {
  collapsed: boolean;
  themeMode: 'light' | 'dark';
  toggleTheme: (v: boolean) => void;
  user?: any;
  logout: () => void;
};

const { Sider } = Layout;

export const Sidebar = ({ collapsed, themeMode, toggleTheme, user, logout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.split('/')[2] || 'admin';

  const items: MenuProps['items'] = [
    {
      type: 'group',
      label: 'Overview',
      children: [
        {
          key: 'dashboard',
          icon: <LayoutDashboard size={18} />,
          label: 'Dashboard',
          onClick: () => navigate('/admin'),
        },
        {
          key: 'analytics',
          icon: <BarChart3 size={18} />,
          label: 'Analytics',
          children: [
            {
              key: 'analytics-overview',
              icon: <LayoutDashboard size={18} />,
              label: 'Tổng quan',
              onClick: () => navigate('/admin/analytics/overview'),
            },
            {
              key: 'analytics-ticket',
              icon: <BarChart3 size={18} />,
              label: 'Phân tích vé',
              onClick: () => navigate('/admin/analytics/ticket'),
            },
            // chuẩn bị scale sau này
            {
              key: 'analytics-revenue',
              icon: <BarChart3 size={18} />,
              label: 'Doanh thu',
              onClick: () => navigate('/admin/analytics/revenue'),
            },
            {
              key: 'analytics-cinema',
              icon: <BarChart3 size={18} />,
              label: 'Rạp chiếu',
              onClick: () => navigate('/admin/analytics/cinema'),
            },
          ],
        },
        {
          key: 'personnel',
          icon: <Users size={18} />,
          label: 'Nhân sự',
          onClick: () => navigate('/admin/users'),
        },
      ],
    },
    { type: 'divider' },
    {
      key: 'genres',
      icon: <FolderOpen size={18} />,
      label: 'Thể Loại',
      onClick: () => navigate('/admin/genres'),
    },
    {
      key: 'movies',
      icon: <Film size={18} />,
      label: 'Thư viện phim',
      onClick: () => navigate('/admin/movies'),
    },
    {
      key: 'users',
      icon: <Users size={18} />,
      label: 'Users',
      onClick: () => navigate('/admin/users'),
    },

    {
      key: 'cinemas',
      icon: <VideoCameraAddOutlined />,
      label: 'Cinemas',
      onClick: () => navigate('/admin/cinemas'),
    },
    {
      key: 'rooms',
      icon: <MonitorPlay size={18} />,
      label: 'Phòng Chiếu',
      onClick: () => navigate('/admin/rooms'),
    },
    {
      key: 'showtime',
      icon: <CalendarPlus size={18} />,
      label: 'Suất Chiếu',
      onClick: () => navigate('/admin/showtime'),
    },
    {
      key: 'promotions',
      icon: <VideoCameraAddOutlined />,
      label: 'Bài Viết',
      onClick: () => navigate('/admin/promotions'),
    },
    {
      type: 'group',
      label: 'Assets',
      children: [
        {
          key: 'product',
          icon: <ProductOutlined />,
          label: 'Product',
          onClick: () => navigate('/admin/product'),
        },
        {
          key: 'media',
          icon: <Image size={18} />,
          label: 'Media',
          onClick: () => navigate('/admin/media'),
        },
      ],
    },
    { type: 'divider' },
    {
      key: 'setting',
      icon: <SettingFilled />,
      label: 'Cài đặt',
      onClick: () => navigate('/admim/setting'),
    },
    {
      key: 'settings',
      icon: <UserOutlined />,
      label: 'Settings',
      onClick: () => navigate('/admin/settings'),
    },
    {
      key: 'chatbot',
      icon: <UserOutlined />,
      label: 'Chatbot',
      onClick: () => navigate('/admin/chatbot'),
    },
  ];

  const textColor = themeMode === 'dark' ? '#fff' : '#000';

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      theme={themeMode}
      className="transition-all duration-200"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
      }}
    >
      <div className="flex h-full flex-col">
        {/* HEADER */}
        <div
          className="mb-2 flex h-16 items-center gap-3 border-b px-6 text-lg font-bold"
          style={{ color: textColor }}
        >
          <ArrowLeftOutlined onClick={() => navigate('/')} className="cursor-pointer" />

          {!collapsed && (
            <Link to="/admin" style={{ color: textColor }}>
              ADMIN PANEL
            </Link>
          )}
        </div>

        {/* MENU (SCROLLABLE) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <Menu theme={themeMode} mode="inline" selectedKeys={[selectedKey]} items={items} />
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: 16,
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div
            className={`flex transition-all duration-200 ${
              collapsed ? 'flex-col items-center gap-5' : 'flex-row items-center justify-between'
            }`}
          >
            <div className="flex cursor-pointer items-center gap-2" onClick={logout}>
              <Avatar
                size="default"
                src={user?.avatar?.url || 'https://i.pravatar.cc/150'}
                icon={!user?.avatar && <UserOutlined />}
              />

              {!collapsed && (
                <span style={{ color: textColor }} className="text-sm">
                  {user?.ho_ten || 'User'}
                </span>
              )}
            </div>
            <Switch size="small" checked={themeMode === 'dark'} onChange={toggleTheme} />
          </div>
        </div>
      </div>
    </Sider>
  );
};
