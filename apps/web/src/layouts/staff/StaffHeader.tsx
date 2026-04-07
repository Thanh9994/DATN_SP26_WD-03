import { Alert, Button, Dropdown, Input, MenuProps, Modal, Typography, message } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@web/hooks/useAuth';
import type { IUserRole } from '@shared/src/schemas';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useBooking } from '@web/hooks/useBooking';

const navItems = [
  { to: '/staff/dashboard', label: 'Tong quan', icon: 'DB' },
  { to: '/staff/movielist', label: 'Danh sach phim', icon: 'MV' },
  { to: '/staff/showtimes', label: 'Suat chieu', icon: 'ST' },
  { to: '/staff/bookings', label: 'Ve dat', icon: 'BK' },
  { to: '/staff/checkin', label: 'Check-in ve', icon: 'CI' },
  { to: '/staff/snacks', label: 'Bap nuoc', icon: 'FD' },
];

export const StaffHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { checkinTicket, isCheckingInTicket } = useBooking();

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
      label: <span style={{ color: 'white' }}>{user?.ho_ten || 'Nhan vien'}</span>,
      onClick: () => navigate('/profile/info'),
    },
    {
      key: 'profile',
      label: 'Trang ca nhan',
      icon: <span className="material-symbols-outlined !text-[18px]">person</span>,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'tickets',
      label: 'Lich su ve',
      icon: <span className="material-symbols-outlined !text-[18px]">history</span>,
      onClick: () => navigate('/profile/tickets'),
    },
    {
      key: 'staff',
      label: 'Khu vuc nhan vien',
      roles: ['staff', 'admin', 'manager'],
      icon: <span className="material-symbols-outlined !text-[18px]">badge</span>,
      onClick: () => navigate('/staff'),
    },
    {
      key: 'admin',
      label: 'Quan tri vien',
      roles: ['admin', 'manager'],
      icon: <span className="material-symbols-outlined !text-[18px]">shield_person</span>,
      onClick: () => navigate('/admin'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      danger: true,
      label: 'Dang xuat',
      icon: <span className="material-symbols-outlined !text-[18px]">logout</span>,
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
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[#0f0f10]/95 via-[#17171a]/95 to-[#0f0f10]/95 px-4 py-4 shadow-lg backdrop-blur-md md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex cursor-pointer items-center gap-3" onClick={() => navigate('/staff')}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30">
                  <span className="text-lg font-bold text-white">ST</span>
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">Nhan vien rap</h1>
                  <p className="text-xs text-white/55 md:text-sm">
                    Quan ly phim, suat chieu, ve va van hanh rap
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
                  <button
                    onClick={handleOpenCheckin}
                    className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 font-semibold text-blue-200 transition hover:bg-blue-500/20"
                  >
                    Check-in ve
                  </button>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Ca lam viec: Sang</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Rap: Chi nhanh chinh</span>
                  <span className="rounded-full border border-white/10 bg-green-500/10 px-3 py-1 text-green-300">Trang thai: Dang hoat dong</span>
                </div>

                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold text-white">{user?.ho_ten || 'Nhan vien'}</p>
                      <p className="text-xs capitalize text-white/50">{user?.role || 'staff'}</p>
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
                      Dang nhap
                    </button>

                    <button
                      onClick={() => navigate('/register')}
                      className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] sm:px-5 sm:text-sm"
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
        title="Check-in ve"
        open={checkinOpen}
        onCancel={() => setCheckinOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <div className="space-y-3">
          <Typography.Text type="secondary">
            Nhap ticket code co trong booking de xac nhan khach da lay ve.
          </Typography.Text>

          <Input
            placeholder="VD: TIC-ABC12345"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
            onPressEnter={handleSubmitCheckin}
            size="large"
          />

          {checkinResult && (
            <Alert
              showIcon
              type="success"
              message="Ve da duoc xac nhan lay thanh cong va da gui email cho khach."
              description={
                <div className="mt-1 text-sm">
                  <div>Ticket code: {checkinResult.ticketCode || '---'}</div>
                  <div>
                    Thoi gian check-in:{' '}
                    {checkinResult.pickedUpAt
                      ? dayjs(checkinResult.pickedUpAt).format('HH:mm DD/MM/YYYY')
                      : dayjs().format('HH:mm DD/MM/YYYY')}
                  </div>
                </div>
              }
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setCheckinOpen(false)}>Dong</Button>
            <Button type="primary" loading={isCheckingInTicket} onClick={handleSubmitCheckin}>
              Xac nhan lay ve
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
