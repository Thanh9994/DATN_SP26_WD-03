import { Alert, Button, Dropdown, Input, Modal, Typography, message } from 'antd';
import type { MenuProps } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@web/hooks/useAuth';
import type { IUserRole } from '@shared/src/schemas';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useStaff } from '@web/hooks/useStaff';
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
  const { checkinTicket, isCheckingInTicket } = useStaff();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [checkinResult, setCheckinResult] = useState<{
    status?: string;
    ticketCode?: string;
    pickedUpAt?: string;
    isLateCheckin?: boolean;
    lateMinutes?: number;
    warningMessage?: string | null;
    movieName?: string;
    roomName?: string;
    cinemaName?: string;
    startTime?: string | null;
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
        isLateCheckin: payload?.isLateCheckin,
        lateMinutes: payload?.lateMinutes,
        warningMessage: payload?.warningMessage,
        movieName: payload?.movieName,
        roomName: payload?.roomName,
        cinemaName: payload?.cinemaName,
        startTime: payload?.startTime,
      });

      if (payload?.isLateCheckin) {
        message.warning(payload?.warningMessage || 'Khach check-in tre');
      } else {
        message.success('Check-in ve thanh cong');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Check-in ve that bai');
      setCheckinResult(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-red-900 bg-gradient-to-r from-gray-950 via-red-950 to-gray-950 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between lg:justify-start">
              <div
                className="group flex cursor-pointer items-center gap-3 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/staff')}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl shadow-red-600/50 transition-all group-hover:shadow-red-500/70">
                  <Film size={24} className="drop-shadow-lg" />
                </div>

                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-red-300 md:text-2xl">
                    Nhan vien rap
                  </h1>
                  <p className="text-xs text-gray-400 transition-colors group-hover:text-red-200">
                    Quan ly phim & van hanh
                  </p>
                </div>
              </div>

              <button
                className="text-gray-300 transition-colors hover:text-red-400 lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <div className={`flex flex-col gap-4 ${mobileMenuOpen ? 'flex' : 'hidden lg:flex'}`}>
              <nav className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? 'border-red-600 bg-gradient-to-r from-red-700 to-red-600 text-white shadow-xl shadow-red-600/50'
                            : 'border-red-900/50 bg-gray-800/40 text-gray-300 hover:border-red-600/70 hover:bg-red-900/20 hover:text-red-300'
                        }`
                      }
                    >
                      <>
                        <Icon size={16} />
                        <span className="hidden sm:inline">{item.label}</span>
                      </>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
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

                {user ? (
                  <div className="flex items-center gap-4 border-t border-red-900 pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold text-white">
                        {user?.ho_ten || 'Nhan vien'}
                      </p>
                      <p className="text-xs capitalize text-gray-400">{user?.role || 'staff'}</p>
                    </div>

                    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                      <div className="h-11 w-11 cursor-pointer overflow-hidden rounded-full border-2 border-red-700 shadow-lg shadow-red-900/50 transition-all hover:scale-105 hover:border-red-500 hover:shadow-red-600/50">
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
                  <div className="flex items-center gap-2 border-t border-red-900 pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                    <button
                      onClick={() => navigate('/login')}
                      className="rounded-lg border border-red-800 bg-gray-900/40 px-4 py-2 text-xs font-semibold text-gray-300 transition-all duration-200 hover:border-red-600 hover:bg-red-900/30 hover:text-red-300"
                    >
                      Dang nhap
                    </button>

                    <button
                      onClick={() => navigate('/register')}
                      className="rounded-lg bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-600/50 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-red-500/70"
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
            <span className="font-bold text-white">Check-in Ve</span>
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
        }}
        width={500}
      >
        <div className="space-y-6">
          <div className="rounded-lg border border-red-900/50 bg-gradient-to-r from-red-950/50 to-red-900/30 p-4">
            <Typography.Text className="text-sm leading-relaxed !text-gray-300">
              <span className="font-semibold text-red-400">Huong dan:</span> Nhap ma ve tu email
              booking hoac tu ung dung de xac nhan khach hang da nhan ve.
            </Typography.Text>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-red-400">
              Ma ve
            </label>
            <Input
              placeholder="Vi du: TIC-ABC12345"
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

          {checkinResult?.isLateCheckin && (
            <Alert
              showIcon
              type="warning"
              message={<span className="font-semibold text-yellow-300">Canh bao check-in tre</span>}
              description={
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-yellow-200">
                    {checkinResult.warningMessage ||
                      `Khach da check-in tre ${checkinResult.lateMinutes || 0} phut.`}
                  </p>

                  <div className="rounded-lg border border-yellow-700/40 bg-yellow-950/30 px-3 py-2">
                    <p className="text-xs uppercase tracking-widest text-yellow-400/70">
                      Suat chieu
                    </p>
                    <p className="text-sm font-semibold text-yellow-200">
                      {checkinResult.movieName || '---'} • {checkinResult.roomName || '---'}
                    </p>
                  </div>
                </div>
              }
              className="rounded-lg border-yellow-700/50 bg-yellow-950/20"
            />
          )}

          {checkinResult && (
            <Alert
              showIcon
              type="success"
              icon={<BadgeCheck size={20} className="text-green-500" />}
              message={<span className="font-semibold text-green-300">Xac nhan thanh cong</span>}
              description={
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-3 rounded-lg border border-green-700/50 bg-green-950/40 px-3 py-2.5">
                    <Ticket size={16} className="flex-shrink-0 text-green-400" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-green-400/70">
                        Ticket Code
                      </p>
                      <p className="text-sm font-bold text-green-300">
                        {checkinResult.ticketCode || '---'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-green-700/50 bg-green-950/40 px-3 py-2.5">
                    <CalendarClock size={16} className="flex-shrink-0 text-green-400" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-green-400/70">
                        Thoi gian nhan ve
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
              className="flex-1 rounded-lg border-gray-700 bg-gray-800/40 font-semibold text-gray-300 hover:border-gray-600 hover:bg-gray-800/60 hover:text-white"
            >
              Dong
            </Button>
            <Button
              type="primary"
              loading={isCheckingInTicket}
              onClick={handleSubmitCheckin}
              className="flex-1 rounded-lg border-0 bg-gradient-to-r from-red-700 to-red-600 font-semibold shadow-lg shadow-red-600/50 hover:shadow-red-500/70"
              icon={<BadgeCheck size={16} />}
            >
              {isCheckingInTicket ? 'Dang xu ly...' : 'Xac nhan nhan ve'}
            </Button>
          </div>

          <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-3">
            <Typography.Text className="text-xs !text-gray-400">
              <span className="font-semibold text-red-400">Luu y:</span> Ve se duoc gui qua email
              cho khach hang sau khi xac nhan thanh cong.
            </Typography.Text>
          </div>
        </div>
      </Modal>
    </>
  );
};