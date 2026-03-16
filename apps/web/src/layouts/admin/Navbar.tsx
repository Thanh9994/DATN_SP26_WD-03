import { Layout, Menu, Avatar, Switch, MenuProps } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  ContainerOutlined,
  ProductOutlined,
  CloudUploadOutlined,
  VideoCameraAddOutlined,
  ArrowLeftOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
          icon: <DashboardOutlined />,
          label: 'Dashboard',
          onClick: () => navigate('/admin'),
        },
        {
          key: 'analytics',
          icon: <BarChartOutlined />,
          label: 'Analytics',
          onClick: () => navigate('/admin/analytics'),
        },
      ],
    },
    { type: 'divider' },
    {
      key: 'genres',
      icon: <ContainerOutlined />,
      label: 'Thể Loại',
      onClick: () => navigate('/admin/genres'),
    },
    {
      key: 'movies',
      icon: <ShoppingOutlined />,
      label: 'Phim',
      onClick: () => navigate('/admin/movies'),
    },
    {
      key: 'users',
      icon: <UserOutlined />,
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
      icon: <VideoCameraAddOutlined />,
      label: 'Phòng Chiếu',
      onClick: () => navigate('/admin/rooms'),
    },
    {
      key: 'promotions',
      icon: <VideoCameraAddOutlined />,
      label: 'Bài Viết',
      onClick: () => navigate('/admin/promotions'),
    },
    {
      key: 'product',
      icon: <ProductOutlined />,
      label: 'Product',
      onClick: () => navigate('/admin/product'),
    },
    {
      key: 'media',
      icon: <CloudUploadOutlined />,
      label: 'Media',
      onClick: () => navigate('/admin/media'),
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
