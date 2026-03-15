import {
  Layout,
  Input,
  ConfigProvider,
  theme,
  Badge,
  Tooltip,
  Typography,
  Dropdown,
  Button,
} from 'antd';
import {
  BellOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './admin/Navbar';
import { useAuth } from '@web/hooks/useAuth';
import {
  markAllCleanupLogsRead,
  useCleanupLogList,
  useCleanupLogs,
} from '@web/hooks/useAdminDashboard';

const { Content, Header } = Layout;
const { Text } = Typography;

export const AdminLayouts = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: cleanupInfo } = useCleanupLogs();
  const { data: cleanupLogs = [] } = useCleanupLogList(10);
  const cleanupSummary = cleanupInfo?.summary ?? 'Chưa có log cleanup';
  const cleanupCount = cleanupInfo?.unreadCount ?? 0;

  const buildLogSummary = (log: { type: string; details?: any }) => {
    if (log.type === 'booking') {
      const expired = log.details?.expired ?? 0;
      const cancelled = log.details?.cancelled ?? 0;
      return `Expired: ${expired} • Cancelled: ${cancelled}`;
    }
    const failed = log.details?.failed ?? 0;
    return `Failed: ${failed}`;
  };

  const toggleTheme = (checked: boolean) => {
    setThemeMode(checked ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: '#1890ff' },
      }}
    >
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: 'all 0.2s',
          minHeight: '100vh',
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
              position: 'sticky',
              top: 0,
              zIndex: 10,
              background: themeMode === 'dark' ? '#141414' : '#fff',
              color: themeMode === 'dark' ? '#fff' : '#000',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            }}
          >
            <div className="flex items-center gap-4">
              {collapsed ? (
                <MenuUnfoldOutlined
                  onClick={() => setCollapsed(false)}
                  className="cursor-pointer text-lg"
                />
              ) : (
                <MenuFoldOutlined
                  onClick={() => setCollapsed(true)}
                  className="cursor-pointer text-lg"
                />
              )}

              <Input.Search
                placeholder="Tìm kiếm nhanh..."
                allowClear
                onSearch={(value) => setSearch(value)}
                className="hidden w-[280px] md:block"
              />
            </div>
            <div className="mr-4 flex items-center justify-end gap-5">
              {cleanupLogs.length === 0 ? (
                <Tooltip title="Chưa có log cleanup">
                  <BellOutlined className="cursor-pointer text-xl" />
                </Tooltip>
              ) : (
                <Dropdown
                  trigger={['click']}
                  popupRender={() => (
                    <div className="min-w-[320px] rounded-md bg-white p-3 shadow-md">
                      <div className="mb-2 flex items-center justify-between">
                        <Text strong>Cleanup Logs</Text>
                        <Button size="small" onClick={() => markAllCleanupLogsRead()}>
                          Đánh dấu đã đọc
                        </Button>
                      </div>
                      <div className="max-h-[300px] space-y-2 overflow-auto">
                        {cleanupLogs.map((log) => (
                          <div key={log._id} className="border-b pb-2 text-xs last:border-b-0">
                            <div className="font-semibold">{log.type.toUpperCase()}</div>
                            <div className="text-gray-500">{buildLogSummary(log)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                >
                  <Tooltip title={cleanupSummary}>
                    <Badge count={cleanupCount}>
                      <BellOutlined
                        className="cursor-pointer text-xl"
                        onClick={() => markAllCleanupLogsRead()}
                      />
                    </Badge>
                  </Tooltip>
                </Dropdown>
              )}

              <Badge count={2}>
                <MailOutlined className="cursor-pointer text-xl" />
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
