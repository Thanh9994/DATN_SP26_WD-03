import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '@web/hooks/useAuth';
import { Button, Upload } from 'antd';
import { Camera, Clapperboard, History, ShieldCheck, Star } from 'lucide-react';

const getInitials = (name?: string) =>
  (name || 'PC')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const ProfileInfo = () => {
  const { user } = useAuth();

  const avatarUrl = user?.avatar?.url;
  const initials = getInitials(user?.ho_ten);

  const statCards = [
    {
      label: 'Điểm tích lũy',
      value: '2,450 XP',
      icon: Star,
      accent: true,
    },
    {
      label: 'Phim đã xem',
      value: '128',
      icon: Clapperboard,
      accent: false,
    },
    {
      label: 'Giao dịch gần nhất',
      value: 'Phòng vé Galaxy - 2 vé',
      icon: History,
      accent: false,
    },
  ];

  return (
    <div className="mx-auto w-full px-2 py-3 md:px-0 md:py-0">
      <div className="mb-4 text-center md:mb-7 md:text-left">
        <h1 className="text-xl font-black uppercase tracking-tight text-white md:text-3xl">
          Thông tin cá nhân
        </h1>
        <p className="text-xs text-zinc-600 md:text-sm">
          Quản lý thông tin tài khoản và bảo mật của bạn tại CineStream.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
          <section className="h-fit rounded-xl border border-white/10 bg-[#261E1E] p-8 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="group relative mb-6 cursor-pointer">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.ho_ten || 'Avatar'}
                    className="h-32 w-32 rounded-full border-[6px] border-[#7a1b43] object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105 md:h-40 md:w-40"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#7a1b43] bg-[#22283a] text-4xl font-black text-white shadow-2xl md:h-40 md:w-40">
                    {initials}
                  </div>
                )}
                <div className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#14182a] bg-[#f3215b] text-white shadow-lg md:h-12 md:w-12">
                  <Camera size={18} />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-lg font-bold text-white">Ảnh đại diện</h2>
                <p className="mt-2 px-4 text-[13px] leading-relaxed text-zinc-500">
                  Định dạng JPG, PNG hoặc GIF. Tối đa 5MB.
                </p>
              </div>

              <Upload
                showUploadList={false}
                className="mt-6 w-full"
                style={{ width: '100%', display: 'block' }}
              >
                <Button
                  icon={<UploadOutlined />}
                  className="!h-11 w-full !rounded-xl !border !border-white/10 !bg-[#312929] !font-bold !text-white transition-all hover:!bg-[#2d334a]"
                >
                  Cập nhật ảnh
                </Button>
              </Upload>
            </div>
          </section>

          {/* Form Fields Section */}
          <section className="rounded-xl border border-white/10 bg-[#261E1E] p-6 shadow-2xl md:p-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Họ và tên
                </label>
                <div className="flex h-14 items-center rounded-lg border border-white/10 bg-[#312929] px-5 text-sm font-semibold text-zinc-100 shadow-inner">
                  {user?.ho_ten || 'Chưa cập nhật'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Số điện thoại
                </label>
                <div className="flex h-14 items-center rounded-lg border border-white/10 bg-[#312929] px-5 text-sm font-semibold text-zinc-100 shadow-inner">
                  {user?.phone || 'Chưa cập nhật'}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="ml-1 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Địa chỉ Email
              </label>
              <div className="flex h-14 items-center rounded-lg border border-white/10 bg-[#312929] px-5 text-sm font-semibold text-zinc-100 shadow-inner">
                {user?.email || 'Chưa cập nhật'}
              </div>
            </div>

            {/* Verification & Action Button */}
            <div className="mt-12 border-t border-white/5 pt-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="mx-auto flex w-fit items-center justify-center gap-3 px-2 py-2 md:mx-0 md:justify-start">
                  <ShieldCheck size={18} className="text-[#f3215b]" />
                  <span className="text-xs font-medium tracking-wider text-[#f3215b]">
                    {user?.isVerified ? 'Tài khoản đã xác thực' : 'Tài khoản chưa xác thực'}
                  </span>
                </div>

                <Button
                  size="large"
                  className="!h-12 !w-full !rounded-2xl !border-none !bg-[#f3215b] !px-10 !font-bold !uppercase !tracking-widest !text-white shadow-[0_12px_24px_rgba(243,33,91,0.3)] transition-all hover:!scale-[1.02] active:!scale-[0.98] md:!w-auto"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`group rounded-xl border px-6 py-2 transition-all duration-300 hover:translate-y-[-4px] ${
                  card.accent
                    ? 'border-[#5b1732] bg-gradient-to-b from-[#3a1023] to-[#1a0b1c] shadow-[0_15px_35px_rgba(91,23,50,0.3)]'
                    : 'border-white/10 bg-[#261E1E] shadow-xl'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-6 ${
                      card.accent ? 'bg-[#6c1838] text-[#ff4f7d]' : 'bg-[#312929] text-zinc-400'
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <div className="mt-4 flex min-w-0 flex-col justify-center leading-none">
                    <p className="loading-none mb-0.5 text-[8px] font-bold uppercase leading-tight tracking-[0.2em] text-zinc-500">
                      {card.label}
                    </p>
                    <p className="truncate text-lg font-black leading-tight text-white md:text-lg">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
