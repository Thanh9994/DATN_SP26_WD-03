import { Dropdown, MenuProps } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@web/hooks/useAuth';
import type { IUserRole } from '@shared/src/schemas';

const navItems = [
  { to: '/staff/dashboard', label: 'Tổng quan', icon: '📊' },
  { to: '/staff/movielist', label: 'Danh sách phim', icon: '🎬' },
  { to: '/staff/showtimes', label: 'Suất chiếu', icon: '🕒' },
  { to: '/staff/bookings', label: 'Vé đặt', icon: '🎟️' },
  { to: '/staff/checkin', label: 'Check-in vé', icon: '✅' },
  { to: '/staff/snacks', label: 'Bắp nước', icon: '🍿' },
];

export const StaffHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  type MenuItem = NonNullable<MenuProps['items']>[number] & {
    roles?: IUserRole[];
  };

  const items: MenuItem[] = [
    {
      key: 'ho_ten',
      label: <span style={{ color: 'white' }}>{user?.ho_ten || 'Nhân viên'}</span>,
      onClick: () => navigate('/profile/info'),
    },
    {
      key: 'profile',
      label: 'Trang cá nhân',
      icon: <span className="material-symbols-outlined !text-[18px]">person</span>,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'tickets',
      label: 'Lịch sử vé',
      icon: <span className="material-symbols-outlined !text-[18px]">history</span>,
      onClick: () => navigate('/profile/tickets'),
    },
    {
      key: 'staff',
      label: 'Khu vực nhân viên',
      roles: ['staff', 'admin', 'manager'],
      icon: <span className="material-symbols-outlined !text-[18px]">badge</span>,
      onClick: () => navigate('/staff'),
    },
    {
      key: 'admin',
      label: 'Quản trị viên',
      roles: ['admin', 'manager'],
      icon: <span className="material-symbols-outlined !text-[18px]">shield_person</span>,
      onClick: () => navigate('/admin'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      danger: true,
      label: 'Đăng xuất',
      icon: <span className="material-symbols-outlined !text-[18px]">logout</span>,
      onClick: handleLogout,
    },
  ];

  const menuItems = items.filter(
    (item) => !('roles' in item) || (user && item.roles?.includes(user.role)),
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[#0f0f10]/95 via-[#17171a]/95 to-[#0f0f10]/95 px-4 py-4 shadow-lg backdrop-blur-md md:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => navigate('/staff')}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30">
                <span className="text-lg font-bold text-white">▶</span>
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                  Nhân viên rạp
                </h1>
                <p className="text-xs text-white/55 md:text-sm">
                  Quản lý phim, suất chiếu, vé và vận hành rạp
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                        : 'border border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Ca làm việc: Sáng
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Rạp: Chi nhánh chính
                </span>
                <span className="rounded-full border border-white/10 bg-green-500/10 px-3 py-1 text-green-300">
                  Trạng thái: Đang hoạt động
                </span>
              </div>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-white">
                      {user?.ho_ten || 'Nhân viên'}
                    </p>
                    <p className="text-xs capitalize text-white/50">
                      {user?.role || 'staff'}
                    </p>
                  </div>

                  <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                    <div className="h-11 w-11 cursor-pointer overflow-hidden rounded-full border-2 border-white/20 shadow-sm transition-all hover:border-red-500">
                      <img
                        alt={user?.ho_ten || 'User profile'}
                        className="h-full w-full object-cover"
                        src={user?.avatar?.url || 'https://i.pravatar.cc/150'}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/85 transition-all hover:bg-white/10 hover:text-white sm:text-sm"
                  >
                    Đăng nhập
                  </button>

                  <button
                    onClick={() => navigate('/register')}
                    className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] sm:px-5 sm:text-sm"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};