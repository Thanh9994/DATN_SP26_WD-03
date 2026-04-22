import { Alert, Button, Dropdown, Input, Modal, Typography, message } from 'antd';
import type { MenuProps } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@web/hooks/useAuth';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useStaff } from '@web/hooks/useStaff';
import {
  LayoutDashboard,
  Clapperboard,
  ScanLine,
  UserCircle2,
  LogOut,
  Film,
  BadgeCheck,
  Ticket,
  CalendarClock,
} from 'lucide-react';

const navItems = [
  { to: '/staff/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { to: '/staff/movielist', label: 'Danh sách phim', icon: Clapperboard },
  
];

const getRoleLabel = (role?: string) => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'manager':
      return 'Quản lý';
    case 'staff':
      return 'Nhân viên';
    default:
      return role || 'Người dùng';
  }
};

export const StaffHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { checkinTicket, isCheckingInTicket } = useStaff();

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

  const items: NonNullable<MenuProps['items']> = [
    {
      key: 'profile',
      label: 'Trang cá nhân',
      icon: <UserCircle2 size={16} />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      danger: true,
      label: 'Đăng xuất',
      icon: <LogOut size={16} />,
      onClick: handleLogout,
    },
  ];

  const handleOpenCheckin = () => {
    setCheckinOpen(true);
    setTicketCode('');
    setCheckinResult(null);
  };

  const handleSubmitCheckin = async () => {
    const normalizedCode = ticketCode.trim().toUpperCase();

    if (!normalizedCode) {
      message.warning('Vui lòng nhập mã vé');
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
        message.warning(payload?.warningMessage || 'Khách check-in trễ');
      } else {
        message.success('Check-in vé thành công');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Check-in vé thất bại');
      setCheckinResult(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-red-900 bg-gradient-to-r from-gray-950 via-red-950 to-gray-950 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => navigate('/staff/dashboard')}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl shadow-red-600/50">
                <Film size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white md:text-2xl">
                  Nhân viên rạp
                </h1>
                <p className="text-xs text-gray-300">Quản lý phim và vận hành</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <nav className="hidden items-center gap-2 lg:flex">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 whitespace-nowrap rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? 'border-red-600 bg-gradient-to-r from-red-700 to-red-500 text-white shadow-lg shadow-red-600/40'
                            : 'border-red-900/50 bg-gray-800/30 text-gray-200 hover:border-red-600/70 hover:bg-red-900/20 hover:text-white'
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}

                <button
                  onClick={handleOpenCheckin}
                  className="rounded-xl border border-red-700/60 bg-red-900/30 px-5 py-3 text-sm font-semibold text-red-200 transition-all duration-200 hover:border-red-600 hover:bg-red-900/50 hover:text-white"
                >
                  Check-in nhanh
                </button>
              </nav>

              {user ? (
                <div className="flex items-center gap-4 border-l border-red-900/70 pl-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-300">
                      {getRoleLabel(user.role)}
                    </p>
                  </div>

                  <Dropdown menu={{ items }} placement="bottomRight" arrow>
                    <div className="h-12 w-12 cursor-pointer overflow-hidden rounded-full border-2 border-red-700 shadow-lg shadow-red-900/50 transition-all hover:scale-105 hover:border-red-500">
                      <img
                        alt={user?.ho_ten || 'Ảnh đại diện'}
                        className="h-full w-full object-cover"
                        src={user?.avatar?.url || 'https://i.pravatar.cc/150'}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="rounded-lg border border-red-800 bg-gray-900/40 px-4 py-2 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-red-600 hover:bg-red-900/30 hover:text-red-300"
                  >
                    Đăng nhập
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <ScanLine size={20} className="text-red-500" />
            <span className="font-bold text-white">Check-in vé</span>
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
              <span className="font-semibold text-red-400">Hướng dẫn:</span> Nhập mã vé từ email
              đặt vé hoặc từ ứng dụng để xác nhận khách hàng đã nhận vé.
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

          {checkinResult?.isLateCheckin && (
            <Alert
              showIcon
              type="warning"
              message={
                <span className="font-semibold text-yellow-300">
                  Cảnh báo check-in trễ
                </span>
              }
              description={
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-yellow-200">
                    {checkinResult.warningMessage ||
                      `Khách đã check-in trễ ${checkinResult.lateMinutes || 0} phút.`}
                  </p>

                  <div className="rounded-lg border border-yellow-700/40 bg-yellow-950/30 px-3 py-2">
                    <p className="text-xs uppercase tracking-widest text-yellow-400/70">
                      Suất chiếu
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
              message={
                <span className="font-semibold text-green-300">
                  Xác nhận thành công
                </span>
              }
              description={
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-3 rounded-lg border border-green-700/50 bg-green-950/40 px-3 py-2.5">
                    <Ticket size={16} className="flex-shrink-0 text-green-400" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-green-400/70">
                        Mã vé
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
              className="flex-1 rounded-lg border-gray-700 bg-gray-800/40 font-semibold text-gray-300 hover:border-gray-600 hover:bg-gray-800/60 hover:text-white"
            >
              Đóng
            </Button>
            <Button
              type="primary"
              loading={isCheckingInTicket}
              onClick={handleSubmitCheckin}
              className="flex-1 rounded-lg border-0 bg-gradient-to-r from-red-700 to-red-600 font-semibold shadow-lg shadow-red-600/50 hover:shadow-red-500/70"
              icon={<BadgeCheck size={16} />}
            >
              {isCheckingInTicket ? 'Đang xử lý...' : 'Xác nhận nhận vé'}
            </Button>
          </div>

          <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-3">
            <Typography.Text className="text-xs !text-gray-400">
              <span className="font-semibold text-red-400">Lưu ý:</span> Vé sẽ được gửi qua email
              cho khách hàng sau khi xác nhận thành công.
            </Typography.Text>
          </div>
        </div>
      </Modal>
    </>
  );
};
