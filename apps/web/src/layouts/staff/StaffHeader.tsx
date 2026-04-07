import { Alert, Button, Dropdown, Input, Modal, Typography, message } from 'antd';
import type { MenuProps } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@web/hooks/useAuth';
import type { IUserRole } from '@shared/src/schemas';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useBooking } from '@web/hooks/useBooking';
import {
  LayoutDashboard,
  Clapperboard,
  CalendarClock,
  Ticket,
  ScanLine,
  Popcorn,
  ShieldCheck,
  UserCircle2,
  History,
  BadgeCheck,
  LogOut,
  Film,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/staff/dashboard', label: 'Tong quan', icon: LayoutDashboard },
  { to: '/staff/movielist', label: 'Danh sach phim', icon: Clapperboard },
  { to: '/staff/showtimes', label: 'Suat chieu', icon: CalendarClock },
  { to: '/staff/bookings', label: 'Ve dat', icon: Ticket },
  { to: '/staff/checkin', label: 'Check-in ve', icon: ScanLine },
  { to: '/staff/snacks', label: 'Bap nuoc', icon: Popcorn },
];

export const StaffHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { checkinTicket, isCheckingInTicket } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [checkinResult, setCheckinResult] = useState<{
    status?: string;
    ticketCode?: string;
    pickedUpAt?: string;
  } | null>(null);

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
      label: <span className="font-semibold">{user?.ho_ten || 'Nhan vien'}</span>,
      onClick: () => navigate('/profile/info'),
    },
    {
      key: 'profile',
      label: 'Trang ca nhan',
      icon: <UserCircle2 size={16} />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'tickets',
      label: 'Lich su ve',
      icon: <History size={16} />,
      onClick: () => navigate('/profile/tickets'),
    },
    {
      key: 'staff',
      label: 'Khu vuc nhan vien',
      roles: ['staff', 'admin', 'manager'],
      icon: <BadgeCheck size={16} />,
      onClick: () => navigate('/staff'),
    },
    {
      key: 'admin',
      label: 'Quan tri vien',
      roles: ['admin', 'manager'],
      icon: <ShieldCheck size={16} />,
      onClick: () => navigate('/admin'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      danger: true,
      label: 'Dang xuat',
      icon: <LogOut size={16} />,
      onClick: handleLogout,
    },
  ];

  const menuItems = items.filter(
    (item) => !('roles' in item) || (user && item.roles?.includes(user.role)),
  );

  const handleOpenCheckin = () => {
    setCheckinOpen(true);
    setTicketCode('');
    setCheckinResult(null);
  };

  const handleSubmitCheckin = async () => {
    const normalizedCode = ticketCode.trim().toUpperCase();

    if (!normalizedCode) {
      message.warning('Vui long nhap ticket code');
      return;
    }

    try {
      const payload = await checkinTicket({ ticketCode: normalizedCode });

      setCheckinResult({
        status: payload?.status,
        ticketCode: payload?.ticketCode || normalizedCode,
        pickedUpAt: payload?.pickedUpAt,
      });

      message.success('Check-in ve thanh cong');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Check-in ve that bai');
      setCheckinResult(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-red-900 bg-gradient-to-r from-gray-950 via-red-950 to-gray-950 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center justify-between lg:justify-start">
              <div
                className="flex cursor-pointer items-center gap-3 group transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/staff')}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl shadow-red-600/50 group-hover:shadow-red-500/70 transition-all">
                  <Film size={24} className="drop-shadow-lg" />
                </div>

                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl group-hover:text-red-300 transition-colors">
                    Nhan vien rap
                  </h1>
                  <p className="text-xs text-gray-400 group-hover:text-red-200 transition-colors">
                    Quan ly phim & van hanh
                  </p>
                </div>
              </div>

              <button
                className="lg:hidden text-gray-300 hover:text-red-400 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Navigation & Controls */}
            <div className={`flex flex-col gap-4 ${mobileMenuOpen ? 'flex' : 'hidden lg:flex'}`}>
              {/* Nav Links */}
              <nav className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `rounded-lg border transition-all duration-200 px-3 py-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap ${
                          isActive
                            ? 'border-red-600 bg-gradient-to-r from-red-700 to-red-600 text-white shadow-xl shadow-red-600/50'
                            : 'border-red-900/50 bg-gray-800/40 text-gray-300 hover:border-red-600/70 hover:bg-red-900/20 hover:text-red-300'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon size={16} />
                          <span className="hidden sm:inline">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Status & User Section */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleOpenCheckin}
                    className="rounded-lg border border-red-700/60 bg-red-900/30 px-3.5 py-2 text-xs font-semibold text-red-300 transition-all duration-200 hover:border-red-600 hover:bg-red-900/50 hover:text-red-200 hover:shadow-lg hover:shadow-red-600/30"
                  >
                    Check-in
                  </button>

                  <span className="rounded-lg border border-red-800/50 bg-red-900/20 px-3.5 py-2 text-xs font-semibold text-red-300">
                    Ca: Sang
                  </span>

                  <span className="rounded-lg border border-red-800/50 bg-red-900/20 px-3.5 py-2 text-xs font-semibold text-red-300">
                    Rap: Chinh
                  </span>

                  <span className="rounded-lg border border-red-700/60 bg-red-900/30 px-3.5 py-2 text-xs font-semibold text-red-200">
                    Hoat dong
                  </span>
                </div>

                {/* User Menu */}
                {user ? (
                  <div className="flex items-center gap-4 border-t border-red-900 lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-4">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-semibold text-white">
                        {user?.ho_ten || 'Nhan vien'}
                      </p>
                      <p className="text-xs capitalize text-gray-400">
                        {user?.role || 'staff'}
                      </p>
                    </div>

                    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                      <div className="h-11 w-11 cursor-pointer overflow-hidden rounded-full border-2 border-red-700 shadow-lg shadow-red-900/50 transition-all hover:border-red-500 hover:shadow-red-600/50 hover:scale-105">
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
                  <div className="flex items-center gap-2 border-t border-red-900 lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-4">
                    <button
                      onClick={() => navigate('/login')}
                      className="rounded-lg border border-red-800 bg-gray-900/40 px-4 py-2 text-xs font-semibold text-gray-300 transition-all duration-200 hover:border-red-600 hover:bg-red-900/30 hover:text-red-300"
                    >
                      Dang nhap
                    </button>

                    <button
                      onClick={() => navigate('/register')}
                      className="rounded-lg bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-600/50 transition-all duration-200 hover:shadow-xl hover:shadow-red-500/70 hover:scale-105"
                    >
                      Dang ky
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <Modal
  title={
    <div className="flex items-center gap-2">
      <ScanLine size={20} className="text-red-500" />
      <span className="text-white font-bold">Check-in Ve</span>
    </div>
  }
  open={checkinOpen}
  onCancel={() => setCheckinOpen(false)}
  footer={null}
  destroyOnHidden
  className="rounded-2xl"
  styles={{
    content: {
      backgroundColor: '#1a1a1a',
      borderColor: '#7f1d1d',
      boxShadow: '0 20px 60px rgba(127, 29, 29, 0.3)',
    },
    header: {
      backgroundColor: '#1a1a1a',
      borderColor: '#7f1d1d',
    },
    // title: {
    //   color: '#ffffff',
    // },
  }}
  width={500}
>
  <div className="space-y-6">
    <div className="rounded-lg border border-red-900/50 bg-gradient-to-r from-red-950/50 to-red-900/30 p-4">
      <Typography.Text className="!text-gray-300 text-sm leading-relaxed">
        <span className="text-red-400 font-semibold">Hướng dẫn:</span> Nhập mã vé từ email booking hoặc từ ứng dụng để xác nhận khách hàng đã nhận vé.
      </Typography.Text>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-red-400">
        Mã vé
      </label>
      <Input
        placeholder="Ví dụ: TIC-ABC12345"
        value={ticketCode}
        onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
        onPressEnter={handleSubmitCheckin}
        size="large"
        className="rounded-lg border-red-900/50 bg-gray-900 text-white placeholder-gray-600"
        style={{
          backgroundColor: '#1f1f1f',
          borderColor: '#7f1d1d',
        }}
        prefix={<ScanLine size={16} className="text-red-500" />}
      />
    </div>

    {checkinResult && (
      <Alert
        showIcon
        type="success"
        icon={<BadgeCheck size={20} className="text-green-500" />}
        message={
          <span className="font-semibold text-green-300">
            Xác nhận thành công
          </span>
        }
        description={
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3 rounded-lg bg-green-950/40 px-3 py-2.5 border border-green-700/50">
              <Ticket size={16} className="text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-green-400/70 font-semibold">
                  Ticket Code
                </p>
                <p className="text-sm font-bold text-green-300">
                  {checkinResult.ticketCode || '---'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-green-950/40 px-3 py-2.5 border border-green-700/50">
              <CalendarClock size={16} className="text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-green-400/70 font-semibold">
                  Thời gian nhận vé
                </p>
                <p className="text-sm font-bold text-green-300">
                  {checkinResult.pickedUpAt
                    ? dayjs(checkinResult.pickedUpAt).format('HH:mm • DD/MM/YYYY')
                    : dayjs().format('HH:mm • DD/MM/YYYY')}
                </p>
              </div>
            </div>
          </div>
        }
        className="rounded-lg border-green-700/50 bg-green-950/20"
      />
    )}

    <div className="flex gap-3 pt-2">
      <Button
        onClick={() => setCheckinOpen(false)}
        className="flex-1 rounded-lg border-gray-700 bg-gray-800/40 text-gray-300 hover:border-gray-600 hover:bg-gray-800/60 hover:text-white font-semibold"
      >
        Đóng
      </Button>
      <Button
        type="primary"
        loading={isCheckingInTicket}
        onClick={handleSubmitCheckin}
        className="flex-1 rounded-lg bg-gradient-to-r from-red-700 to-red-600 font-semibold shadow-lg shadow-red-600/50 hover:shadow-red-500/70 border-0"
        icon={<BadgeCheck size={16} />}
      >
        {isCheckingInTicket ? 'Đang xử lý...' : 'Xác nhận nhận vé'}
      </Button>
    </div>

    <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-3">
      <Typography.Text className="!text-gray-400 text-xs">
        <span className="text-red-400 font-semibold">Lưu ý:</span> Vé sẽ được gửi qua email cho khách hàng sau khi xác nhận thành công.
      </Typography.Text>
    </div>
  </div>
</Modal>
    </>
  );
};