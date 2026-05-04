import { type MenuProps } from 'antd';
import {
  ProductOutlined,
  VideoCameraAddOutlined,
  SettingFilled,
  SettingOutlined,
} from '@ant-design/icons';
import {
  BarChart3,
  CalendarPlus,
  Film,
  FolderOpen,
  Image,
  LayoutDashboard,
  MonitorPlay,
  Ticket,
  Users,
} from 'lucide-react';
import { createElement } from 'react';

type NavigateFn = (to: string) => void;

const lucideIcon = (Icon: React.ElementType, size = 18) => createElement(Icon, { size });
const antIcon = (Icon: React.ElementType) => createElement(Icon);


// ✅ Gom route matcher thành object
const ROUTE_PREFIXES: Record<string, string> = {
  'analytics-overview': '/admin/analytics/overview',
  'analytics-ticket': '/admin/analytics/ticket',
  'analytics-revenue': '/admin/analytics/revenue',
  'analytics-cinema': '/admin/analytics/cinema',
  tickets: '/admin/tickets',
  showtime: '/admin/showtime',
  rooms: '/admin/rooms',
  cinemas: '/admin/cinemas',
  movies: '/admin/movies',
  genres: '/admin/genres',
  product: '/admin/product',
  media: '/admin/media',
  promotions: '/admin/promotions',
  users: '/admin/users',
  staff: '/admin/staff',
  personnel: '/admin/personnel',
  general: '/admin/settings/general',
  settings: '/admin/settings',
};

export const getSelectedKey = (path: string) =>
  Object.entries(ROUTE_PREFIXES).find(([_, prefix]) => path.startsWith(prefix))?.[0] ?? 'dashboard';

const menuItem = (
  key: string,
  label: string,
  icon: React.ReactNode,
  path?: string,
  navigate?: NavigateFn,
  children?: MenuProps['items'],
) => ({
  key,
  icon,
  label,
  onClick: path && navigate ? () => navigate(path) : undefined,
  children,
});


export const MENU_CONFIG = (navigate: NavigateFn): MenuProps['items'] => [
  {
    type: 'group',
    label: 'Overview',
    children: [
      menuItem('dashboard', 'Dashboard', lucideIcon(LayoutDashboard), '/admin', navigate),
      {
        key: 'analytics',
        icon: lucideIcon(BarChart3),
        label: 'Analytics',
        children: [
          menuItem(
            'analytics-overview',
            'Tổng quan',
            lucideIcon(LayoutDashboard),
            '/admin/analytics/overview',
            navigate,
          ),
          menuItem(
            'analytics-ticket',
            'Phân tích vé',
            lucideIcon(BarChart3),
            '/admin/analytics/ticket',
            navigate,
          ),
          menuItem(
            'analytics-revenue',
            'Doanh thu',
            lucideIcon(BarChart3),
            '/admin/analytics/revenue',
            navigate,
          ),
          menuItem(
            'analytics-cinema',
            'Rạp chiếu',
            lucideIcon(BarChart3),
            '/admin/analytics/cinema',
            navigate,
          ),
        ],
      },
      menuItem('personnel', 'Nhân sự', lucideIcon(Users), '/admin/personnel', navigate),
      menuItem('users', 'Người dùng', lucideIcon(Users), '/admin/users', navigate),
    ],
  },
  { type: 'divider' },
  menuItem('genres', 'Thể loại', lucideIcon(FolderOpen), '/admin/genres', navigate),
  menuItem('movies', 'Thư viện phim', lucideIcon(Film), '/admin/movies', navigate),
  menuItem('cinemas', 'Rạp chiếu', antIcon(VideoCameraAddOutlined), '/admin/cinemas', navigate),
  menuItem('rooms', 'Phòng chiếu', lucideIcon(MonitorPlay), '/admin/rooms', navigate),
  menuItem('showtime', 'Suất chiếu', lucideIcon(CalendarPlus), '/admin/showtime', navigate),
  menuItem('tickets', 'Quản lý vé', lucideIcon(Ticket), '/admin/tickets', navigate),
  menuItem(
    'promotions',
    'Bài viết',
    antIcon(VideoCameraAddOutlined),
    '/admin/promotions',
    navigate,
  ),
  {
    type: 'group',
    label: 'Assets',
    children: [
      menuItem('product', 'Sản phẩm', antIcon(ProductOutlined), '/admin/product', navigate),
      menuItem('media', 'Media', lucideIcon(Image), '/admin/media', navigate),
    ],
  },
  { type: 'divider' },
  menuItem('general', 'Cấu hình', antIcon(SettingOutlined), '/admin/settings/general', navigate),
  menuItem('settings', 'Cài đặt', antIcon(SettingFilled), '/admin/settings', navigate),
];

