import { Layout, Menu, Avatar, Switch } from 'antd';
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MENU_CONFIG, getSelectedKey } from './sidebarConfig';

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
  const { pathname } = useLocation();

  const selectedKey = getSelectedKey(pathname);
  const openKeys = selectedKey.startsWith('analytics-') ? ['analytics'] : [];
  const items = MENU_CONFIG(navigate);
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

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <Menu
            theme={themeMode}
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={openKeys}
            items={items}
          />
        </div>

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
